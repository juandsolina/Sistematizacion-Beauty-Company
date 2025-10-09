// frontend/src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { setIsCartOpen, getCount } = useCart();
  const itemCount = getCount();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-pink-500">
            Susana T
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-pink-500 transition"
            >
              Inicio
            </Link>
            <Link
              to="/tienda"
              className="text-gray-300 hover:text-pink-500 transition"
            >
              Tienda
            </Link>
            <Link
              to="/nosotros"
              className="text-gray-300 hover:text-pink-500 transition"
            >
              Nosotros
            </Link>
            <Link
              to="/contacto"
              className="text-gray-300 hover:text-pink-500 transition"
            >
              Contacto
            </Link>
          </div>

          {/* Cart Button - Optimizado */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 hover:bg-gray-800 rounded-lg transition-all hover:scale-105 group"
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="w-5 h-5 text-gray-300 group-hover:text-pink-500 transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-pink-500 to-pink-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg shadow-pink-500/50 animate-pulse">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}