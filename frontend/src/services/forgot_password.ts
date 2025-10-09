// src/js/forgot_password.ts
import { API_BASE } from "./config";

document.getElementById("forgot-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("email") as HTMLInputElement | null;
  const message = document.getElementById("message");

  if (!emailInput || !message) return;

  const email = emailInput.value.trim();

  if (!email) {
    message.textContent = "Por favor ingrese un correo electrónico válido.";
    message.setAttribute("style", "color:red;");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/forgot_password.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      // redirige con el correo como query param
      window.location.href = `reset_password.html?email=${encodeURIComponent(email)}`;
    } else {
      message.textContent = data.mensaje || "❌ Error al procesar la solicitud.";
      message.setAttribute("style", "color:red;");
    }
  } catch (error) {
    console.error("Error:", error);
    message.textContent = "⚠️ Error al conectar con el servidor.";
    message.setAttribute("style", "color:red;");
  }
});
