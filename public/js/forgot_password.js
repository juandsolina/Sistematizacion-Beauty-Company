document.getElementById("forgot-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const message = document.getElementById("message");

    try {
        const response = await fetch("forgot_password.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email })
        });

        const data = await response.json();

        if (data.status === "success") {
            // En vez de mandar correo, redirigimos directamente al formulario
            window.location.href = `reset_password.html?email=${encodeURIComponent(email)}`;
        } else {
            message.textContent = data.mensaje;
        }
    } catch (error) {
        message.textContent = "Error al conectar con el servidor.";
    }
});
