// frontend/src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Header.css';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { setIsCartOpen, getCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const itemCount = getCount();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    alert("👋 Sesión cerrada");
    navigate("/");
  };

  const handleScroll = (id: string) => {
    setIsMenuOpen(false);
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Función para obtener solo el primer nombre
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  return (
    <header className={isSticky ? 'sticky' : ''}>
      
      <Link to="/" className="logo" onClick={closeMenu}>
        <i className="bx bx-home"></i>
        <span className="logo-text">SusanatiendaBogotá</span>
      </Link>

      <ul className={`navlist ${isMenuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={closeMenu}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/catalogo" className={location.pathname === "/catalogo" ? "active" : ""} onClick={closeMenu}>
            Catálogo
          </Link>
        </li>
        <li>
          <Link to="/tienda" className={location.pathname === "/tienda" ? "active" : ""} onClick={closeMenu}>
            Tienda
          </Link>
        </li>
        <li>
          <a href="#reviews" onClick={() => handleScroll("reviews")}>
            Clientes
          </a>
        </li>
        <li>
          <a href="#contact" onClick={() => handleScroll("contact")}>
            Contactar
          </a>
        </li>
        
        {isAuthenticated && isAdmin && (
          <li>
            <Link to="/admin" className={location.pathname.startsWith("/admin") ? "active" : ""} onClick={closeMenu}>
              Admin
            </Link>
          </li>
        )}
      </ul>

      <div className="nav-icons">
        
        {/* Carrito */}
        <button
          onClick={() => setIsCartOpen(true)}
          type="button"
          className="cart-btn"
          aria-label="Abrir carrito"
        >
          <i className="bx bx-cart"></i>
          {itemCount > 0 && (
            <span className="cart-count">
              {itemCount}
            </span>
          )}
        </button>

        {/* Usuario no autenticado */}
        {!isAuthenticated ? (
          <Link to="/login" onClick={closeMenu} aria-label="Iniciar sesión">
            <i className="bx bx-user"></i>
          </Link>
        ) : (
          <>
            {/* Usuario autenticado - Solo primer nombre */}
            {user && (
              <span className="welcome-text" title={`Bienvenido, ${user.nombre}`}>
                Hola, {getFirstName(user.nombre)}
              </span>
            )}
            
            {/* Botón de logout */}
            <button 
              onClick={handleLogout} 
              id="logout-btn"
              aria-label="Cerrar sesión"
            >
              Salir
            </button>
          </>
        )}
        
        {/* Menú hamburguesa */}
        <div 
          className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'}`} 
          id="menu-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          role="button"
          aria-label="Menú"
          tabIndex={0}
        ></div>
      </div>
    </header>
  );
}