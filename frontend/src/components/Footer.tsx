// frontend/src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="footer bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto text-center">
        <h2 className="text-lg font-semibold mb-2">Susanatienda Bogotá</h2>
        <p className="text-sm text-gray-400 mb-4">
          Tu tienda de confianza en productos de belleza, moda y cuidado personal.
        </p>

        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400">
            Instagram
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-400">
            Facebook
          </a>
          <a href="/contacto" className="hover:text-green-400">
            Contáctanos
          </a>
        </div>

        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Susanatienda Bogotá. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
