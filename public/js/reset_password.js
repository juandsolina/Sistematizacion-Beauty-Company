document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");

    const form = document.getElementById("reset-form");
    const message = document.getElementById("message");

    if (!email) {
        message.textContent = "URL inválida. Falta el correo.";
        form.style.display = "none";
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // 👇 Usa los mismos IDs que en el HTML
        const newPassword = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

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

            const data = await response.json();

            if (data.status === "success") {
                message.style.color = "lightgreen";
                message.textContent = "Contraseña restablecida con éxito. Redirigiendo...";
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                message.textContent = data.mensaje;
            }
        } catch (error) {
            message.textContent = "Error al conectar con el servidor.";
        }
    });
});
