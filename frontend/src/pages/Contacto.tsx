// frontend/src/pages/Contacto.tsx
import React, { JSX, useState } from "react";

export default function Contacto(): JSX.Element {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nombre, correo, mensaje });
    setEnviado(true);
    setNombre("");
    setCorreo("");
    setMensaje("");
  };

  return (
    <section className="page container mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
        Contáctanos
      </h1>

      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        ¿Tienes dudas, sugerencias o deseas información sobre nuestros
        productos? ¡Nos encantaría leerte! Déjanos tu mensaje y te responderemos
        lo antes posible.
      </p>

      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        {enviado ? (
          <div className="text-center text-green-600 font-medium">
            ✅ ¡Gracias por contactarnos! Te responderemos pronto.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="tunombre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white font-semibold py-2 rounded-lg hover:bg-pink-700 transition"
            >
              Enviar mensaje
            </button>
          </form>
        )}
      </div>

      <div className="mt-12 text-center text-gray-700">
        <p className="mb-2">
          📍 <strong>Ubicación:</strong> Calle 123 #45-67, Bogotá, Colombia
        </p>
        <p className="mb-2">
          📞 <strong>Teléfono:</strong> +57 310 555 1234
        </p>
        <p>
          📧 <strong>Correo:</strong> contacto@susanatienda.com
        </p>
      </div>
    </section>
  );
}
