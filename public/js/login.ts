document.getElementById("login-form")?.addEventListener("submit", async function(event) {
  event.preventDefault();

  const emailInput = document.getElementById("email") as HTMLInputElement | null;
  const passwordInput = document.getElementById("password") as HTMLInputElement | null;
  const errorMessage = document.getElementById("error-message");

  if (!emailInput || !passwordInput || !errorMessage) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    errorMessage.textContent = "Por favor complete todos los campos.";
    errorMessage.style.color = "red";
    return;
  }

  try {
    const response = await fetch("/api/auth/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, password })
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      errorMessage.textContent = "✅ Bienvenido, " + data.usuario.nombre;
      errorMessage.style.color = "green";

      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      setTimeout(() => {
        if (data.usuario.rol === "admin") {
          window.location.href = "crud.html";
        } else {
          window.location.href = "index.html";
        }
      }, 1500);
    } else {
      errorMessage.textContent = data.mensaje || "Usuario o contraseña incorrectos.";
      errorMessage.style.color = "red";
    }
  } catch (error) {
    console.error("Error:", error);
    errorMessage.textContent = "⚠️ Error de conexión con el servidor.";
    errorMessage.style.color = "red";
  }
});
