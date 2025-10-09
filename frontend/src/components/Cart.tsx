// frontend/src/components/Cart.tsx
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../services/script";

export default function Cart() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    increment,
    decrement,
    clearCart,
    getTotal,
    getCount,
  } = useCart();

  if (!isCartOpen) return null;

  const total = getTotal();
  const itemCount = getCount();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 transition-opacity"
        style={{ zIndex: 99998 }}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Panel */}
      <div 
        className="fixed top-0 h-full w-full max-w-md bg-[#0a0a0a] shadow-2xl flex flex-col animate-slide-in"
        style={{ 
          right: 0, 
          zIndex: 99999,
          position: 'fixed'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-pink-600/20 to-purple-600/20">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-pink-500" />
            <h2 className="text-2xl font-bold text-white">
              Carrito <span className="text-pink-500">({itemCount})</span>
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-6 h-6 text-gray-300 hover:text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingBag className="w-20 h-20 mb-4 opacity-30" />
              <p className="text-xl font-semibold mb-2">Tu carrito está vacío</p>
              <p className="text-sm text-gray-500">Agrega productos para comenzar</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 flex gap-3 border border-gray-700 hover:border-pink-500/50 transition-all"
              >
                {/* Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={resolveImageUrl(item.imagen || undefined)}
                    alt={item.nombre}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-700"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1 line-clamp-2 leading-tight">
                      {item.nombre}
                    </h3>
                    <p className="text-pink-500 font-bold text-base">
                      ${item.precio.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="flex items-center gap-1 bg-gray-700/50 rounded-md border border-gray-600">
                      <button
                        onClick={() => decrement(item.id)}
                        className="p-1.5 hover:bg-pink-600 rounded-md transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3.5 h-3.5 text-white" />
                      </button>
                      <span className="px-3 text-white font-bold text-sm min-w-[32px] text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => increment(item.id)}
                        className="p-1.5 hover:bg-pink-600 rounded-md transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors group flex-shrink-0"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-800 p-4 bg-gradient-to-b from-gray-900 to-black space-y-4">
            {/* Subtotal */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Subtotal:</span>
                <span className="text-white font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Envío:</span>
                <span className="text-green-400 font-semibold">Gratis</span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-lg">Total:</span>
                  <span className="text-2xl font-bold text-pink-500">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-pink-500/50">
                Proceder al pago
              </button>
              <button
                onClick={clearCart}
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded-lg transition-colors border border-gray-700 hover:border-gray-600"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a4a4a;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ec4899;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}