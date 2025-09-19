document.getElementById("forgot-form")?.addEventListener("submit", async function (event) {
  event.preventDefault();

  const emailInput = document.getElementById("email") as HTMLInputElement | null;
  const message = document.getElementById("message");

  if (!emailInput || !message) return;

  const email = emailInput.value.trim();

  if (!email) {
    message.textContent = "Por favor ingrese un correo electrónico válido.";
    return;
  }

  try {
    const response = await fetch("forgot_password.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email })
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      window.location.href = `reset_password.html?email=${encodeURIComponent(email)}`;
    } else {
      message.textContent = data.mensaje || "Error al procesar la solicitud.";
    }
  } catch (error) {
    message.textContent = "Error al conectar con el servidor.";
    console.error(error);
  }
});
