document.getElementById("register-form")?.addEventListener("submit", async function(event) {
  event.preventDefault();

  const emailInput = document.getElementById("email") as HTMLInputElement | null;
  const usernameInput = document.getElementById("username") as HTMLInputElement | null;
  const passwordInput = document.getElementById("password") as HTMLInputElement | null;
  const confirmPasswordInput = document.getElementById("confirm-password") as HTMLInputElement | null;
  const errorMessage = document.getElementById("error-message");

  if (!emailInput || !usernameInput || !passwordInput || !confirmPasswordInput || !errorMessage) return;

  const email = emailInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!email || !username || !password || !confirmPassword) {
    errorMessage.textContent = "Por favor, complete todos los campos.";
    errorMessage.style.color = "red";
    return;
  }

  if (password.length < 6) {
    errorMessage.textContent = "La contraseña debe tener al menos 6 caracteres.";
    errorMessage.style.color = "red";
    return;
  }

  if (password !== confirmPassword) {
    errorMessage.textContent = "Las contraseñas no coinciden.";
    errorMessage.style.color = "red";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:49528/api/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre: username, password })
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      errorMessage.textContent = "✅ Registro exitoso. Redirigiendo...";
      errorMessage.style.color = "green";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      errorMessage.textContent = data.mensaje || "❌ Error al registrar.";
      errorMessage.style.color = "red";
    }
  } catch (error) {
    errorMessage.textContent = "⚠️ Error de conexión con el servidor.";
    errorMessage.style.color = "red";
    console.error(error);
  }
});
