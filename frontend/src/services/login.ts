document.addEventListener('DOMContentLoaded', (): void => {
    const loginForm = document.getElementById("login-form") as HTMLFormElement | null;
    const errorMessage = document.getElementById("error-message") as HTMLParagraphElement | null;

    // Verificar que los elementos existan
    if (!loginForm || !errorMessage) {
        console.error('Error: No se encontraron los elementos del formulario');
        return;
    }

    loginForm.addEventListener("submit", async function (event: Event): Promise<void> {
        event.preventDefault();

        // Obtener elementos del formulario
        const emailInput = document.getElementById("email") as HTMLInputElement | null;
        const passwordInput = document.getElementById("password") as HTMLInputElement | null;

        if (!emailInput || !passwordInput) {
            console.error('Error: No se encontraron los campos de entrada');
            return;
        }

        // Limpiar espacios en blanco
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validación de campos vacíos
        if (!email || !password) {
            errorMessage.textContent = "Por favor complete todos los campos.";
            errorMessage.style.color = "red";
            errorMessage.style.display = "block";
            return;
        }

        // Validación de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorMessage.textContent = "Por favor ingrese un email válido.";
            errorMessage.style.color = "red";
            errorMessage.style.display = "block";
            return;
        }

        // Obtener botón de submit
        const submitButton = loginForm.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalText = submitButton.textContent || 'Ingresar';
        
        // Deshabilitar botón y mostrar estado de carga
        submitButton.textContent = 'Ingresando...';
        submitButton.disabled = true;
        errorMessage.style.display = 'none';

        // Crear FormData para enviar al servidor
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
            // Realizar petición al servidor - RUTA PARA DOCKER
            const response = await fetch("/src/api/auth/login.php", {
                method: "POST",
                body: formData
            });

            // Verificar que la respuesta sea exitosa
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }

            // Definir interface para la respuesta
            interface Usuario {
                id: number;
                nombre: string;
                email: string;
                rol: string;
            }

            interface LoginResponse {
                status: string;
                mensaje?: string;
                usuario?: Usuario;
            }

            // Parsear respuesta JSON
            const data: LoginResponse = await response.json();

            // Verificar si el login fue exitoso
            if (data.status === "success" && data.usuario) {
                // Mostrar mensaje de bienvenida
                errorMessage.textContent = `✅ Bienvenido, ${data.usuario.nombre}`;
                errorMessage.style.color = "green";
                errorMessage.style.display = "block";

                // Guardar datos del usuario en sessionStorage
                sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
                sessionStorage.setItem("user_id", data.usuario.id.toString());
                sessionStorage.setItem("user_name", data.usuario.nombre);
                sessionStorage.setItem("user_rol", data.usuario.rol);

                // Redirigir según el rol del usuario
                setTimeout(() => {
                    if (data.usuario!.rol === "admin") {
                        window.location.href = "crud.html";
                    } else {
                        window.location.href = "catalogo.html";
                    }
                }, 1500);
            } else {
                // Mostrar mensaje de error del servidor
                throw new Error(data.mensaje || "Usuario o contraseña incorrectos.");
            }
        } catch (err) {
            // Manejo de errores
            console.error('Error en el login:', err);
            
            let mensajeError = "⚠️ Error de conexión con el servidor.";
            
            if (err instanceof Error) {
                mensajeError = err.message;
            }
            
            errorMessage.textContent = mensajeError;
            errorMessage.style.color = "red";
            errorMessage.style.display = "block";
            
            // Restaurar botón
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
});