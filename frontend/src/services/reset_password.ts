// src/js/reset_password.ts
import { API_BASE } from "./config";

document.addEventListener("DOMContentLoaded", () => {
  const params  = new URLSearchParams(location.search);
  const token   = params.get("token");           // flujo seguro (recomendado)
  const email   = params.get("email");           // fallback si aún usas email
  const form    = document.getElementById("reset-form") as HTMLFormElement | null;
  const message = document.getElementById("message");

  if (!form || !message) return;

  // Si no hay token ni email, no podemos continuar
  if (!token && !email) {
    message.textContent = "URL inválida. Falta token o correo.";
    (form as HTMLElement).style.display = "none";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPasswordInput     = document.getElementById("password") as HTMLInputElement | null;
    const confirmPasswordInput = document.getElementById("confirm-password") as HTMLInputElement | null;
    if (!newPasswordInput || !confirmPasswordInput) return;

    const newPassword = newPasswordInput.value.trim();
    const confirm     = confirmPasswordInput.value.trim();

    if (newPassword.length < 6) {
      message.textContent = "La contraseña debe tener al menos 6 caracteres.";
      message.setAttribute("style", "color:red;");
      return;
    }
    if (newPassword !== confirm) {
      message.textContent = "Las contraseñas no coinciden.";
      message.setAttribute("style", "color:red;");
      return;
    }

    try {
      // Preferir token; si no hay, usar email como fallback temporal
      const payload: any = token
        ? { token, password: newPassword }
        : { email, password: newPassword };

      const resp = await fetch(`${API_BASE}/reset_password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      if (data.status === "success") {
        message.textContent = "✅ Contraseña restablecida. Redirigiendo…";
        message.setAttribute("style", "color:lightgreen;");
        setTimeout(() => (window.location.href = "login.html"), 1500);
      } else {
        message.textContent = data.mensaje || "Error al restablecer la contraseña.";
        message.setAttribute("style", "color:red;");
      }
    } catch (err) {
      console.error(err);
      message.textContent = "⚠️ Error al conectar con el servidor.";
      message.setAttribute("style", "color:red;");
    }
  });
});
