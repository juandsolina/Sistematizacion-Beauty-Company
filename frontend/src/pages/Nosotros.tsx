// frontend/src/pages/Nosotros.tsx
import React from "react";

export default function Nosotros() {
  return (
    <section className="page container mx-auto py-12 px-6 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
        Sobre Nosotros
      </h1>

      <div className="max-w-4xl mx-auto leading-relaxed text-lg">
        <p className="mb-6">
          <strong>Susanatienda Bogotá</strong> nació con la idea de ofrecer una
          experiencia única en productos de belleza, moda y bienestar, brindando
          siempre calidad, autenticidad y cercanía. Nuestro objetivo es ser más
          que una tienda: queremos ser una comunidad que inspira confianza,
          estilo y autocuidado.
        </p>

        <p className="mb-6">
          Desde nuestros inicios en 2020, hemos crecido gracias al apoyo de
          nuestros clientes y al compromiso con la excelencia. Cada producto que
          ofrecemos ha sido cuidadosamente seleccionado para garantizar los más
          altos estándares y cumplir con las necesidades reales de quienes nos
          eligen día a día.
        </p>

        <p className="mb-8">
          Nos apasiona apoyar el talento local, trabajar con marcas colombianas
          y contribuir al desarrollo sostenible mediante empaques ecológicos y
          prácticas responsables.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 text-pink-600">
              Misión
            </h2>
            <p>
              Proporcionar productos de belleza y moda de alta calidad, fomentando
              la confianza, el bienestar y el estilo propio de cada cliente.
            </p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 text-pink-600">
              Visión
            </h2>
            <p>
              Ser la tienda líder en Colombia reconocida por su innovación,
              compromiso social y conexión con los clientes.
            </p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 text-pink-600">
              Valores
            </h2>
            <ul className="list-disc list-inside text-left">
              <li>Honestidad y transparencia</li>
              <li>Calidad y compromiso</li>
              <li>Respeto por las personas y el medio ambiente</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
