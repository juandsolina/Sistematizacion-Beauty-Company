// frontend/src/components/Cart.tsx
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../services/script';
import { formatPrice } from '../utils/formatPrice';
import '../styles/carrito.css';

export default function Cart() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    increment, 
    decrement, 
    getTotal 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="cart-overlay"
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed',
          inset: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 99998,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}
      />

      {/* Sidebar */}
      <div 
        className="cart-sidebar"
        style={{
          position: 'fixed',
          right: '0',
          top: '0',
          height: '100vh',
          width: '100%',
          maxWidth: '28rem',
          background: 'linear-gradient(to bottom, #111827, #1f2937)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-content">
            <div className="cart-icon-wrapper">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <div>
              <h2 className="cart-title">Tu Carrito</h2>
              <p className="cart-subtitle">
                {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="cart-close-btn"
            aria-label="Cerrar carrito"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <ShoppingBag size={40} className="text-gray-600" />
              </div>
              <p className="cart-empty-title">Tu carrito está vacío</p>
              <p className="cart-empty-subtitle">Agrega productos para comenzar</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="cart-empty-btn"
              >
                Explorar Productos
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-content">
                    {/* Imagen */}
                    <div className="cart-item-image-wrapper">
                      <div className="cart-item-image-container">
                        <img
                          src={resolveImageUrl(item.imagen || undefined)}
                          alt={item.nombre}
                          className="cart-item-image"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="14" fill="%239ca3af" text-anchor="middle" dy=".3em"%3ESin imagen%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.nombre}</h3>
                      
                      <div className="cart-item-price-row">
                        <p className="cart-item-price">
                          {formatPrice(item.precio)}
                        </p>
                        <span className="cart-item-unit">c/u</span>
                      </div>

                      {/* Controles */}
                      <div className="cart-item-controls">
                        <div className="cart-qty-controls">
                          <button
                            onClick={() => decrement(item.id)}
                            className="cart-qty-btn"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="cart-qty-value">{item.cantidad}</span>
                          <button
                            onClick={() => increment(item.id)}
                            className="cart-qty-btn"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <div className="cart-item-subtotal">
                          Subtotal: <span className="cart-item-subtotal-value">
                            {formatPrice(item.precio * item.cantidad)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="cart-item-delete"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-footer-content">
              {/* Resumen */}
              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.cantidad, 0)} items)</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className="cart-summary-row" style={{ marginTop: '0.5rem' }}>
                  <span>Envío</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>Gratis</span>
                </div>
              </div>
              
              {/* Total */}
              <div className="cart-total">
                <span className="cart-total-label">Total:</span>
                <span className="cart-total-value">{formatPrice(getTotal())}</span>
              </div>

              {/* Botones */}
              <button className="cart-checkout-btn">
                Proceder al Pago
              </button>
              
              <button
                onClick={() => setIsCartOpen(false)}
                className="cart-continue-btn"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}