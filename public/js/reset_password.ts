document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  const form = document.getElementById("reset-form") as HTMLFormElement | null;
  const message = document.getElementById("message");

  if (!email) {
    if (message) message.textContent = "URL inválida. Falta el correo.";
    if (form) form.style.display = "none";
    return;
  }

  if (!form || !message) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const newPasswordInput = document.getElementById("password") as HTMLInputElement | null;
    const confirmPasswordInput = document.getElementById("confirm-password") as HTMLInputElement | null;

    if (!newPasswordInput || !confirmPasswordInput) return;

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword.length < 6) {
      message.textContent = "La contraseña debe tener al menos 6 caracteres.";
      return;
    }

    if (newPassword !== confirmPassword) {
      message.textContent = "Las contraseñas no coinciden.";
      return;
    }

    try {
      const response = await fetch("reset_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, newPassword })
      });

      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        message.style.color = "lightgreen";
        message.textContent = "Contraseña restablecida con éxito. Redirigiendo...";
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        message.textContent = data.mensaje || "Error al restablecer la contraseña.";
      }
    } catch (error) {
      message.textContent = "Error al conectar con el servidor.";
      console.error(error);
    }
  });
});
