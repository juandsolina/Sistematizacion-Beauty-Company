document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const errorMessage = document.getElementById("error-message");

    // Validaciones
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
        const response = await fetch("register.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email, username, password })
        });

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
    }
});
