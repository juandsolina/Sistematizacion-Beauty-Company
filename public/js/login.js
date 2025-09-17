document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");

    try {
        const response = await fetch("/api/auth/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email, password })
        });

        const data = await response.json();

        if (data.status === "success") {
            // Mensaje de bienvenida
            errorMessage.textContent = "✅ Bienvenido, " + data.usuario.nombre;
            errorMessage.style.color = "green";

            // Guardar usuario en localStorage
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            // Redirigir según el rol
            setTimeout(() => {
                if (data.usuario.rol === "admin") {
                    window.location.href = "crud.html"; // Panel de gestión de productos
                } else {
                    window.location.href = "index.html"; // Página principal para clientes
                }
            }, 1500);
        } else {
            errorMessage.textContent = data.mensaje;
            errorMessage.style.color = "red";
        }
    } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent = "⚠️ Error de conexión con el servidor.";
        errorMessage.style.color = "red";
    }
});
