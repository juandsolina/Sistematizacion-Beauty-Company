import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { setIsCartOpen, getCount } = useCart();
  const location = useLocation();
  const itemCount = getCount();

  useEffect(() => {
    // Script para el menú móvil
    const menuIcon = document.getElementById('menu-icon');
    const navlist = document.querySelector('.navlist');
    
    const handleMenuClick = () => {
      navlist?.classList.toggle('active');
    };

    if (menuIcon) {
      menuIcon.addEventListener('click', handleMenuClick);
    }

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.navlist a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navlist?.classList.remove('active');
      });
    });

    // Script para el header sticky
    const header = document.querySelector('header');
    const handleScroll = () => {
      if (header) {
        header.classList.toggle('sticky', window.scrollY > 100);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (menuIcon) {
        menuIcon.removeEventListener('click', handleMenuClick);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    alert("👋 Sesión cerrada");
    window.location.href = "/";
  };

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header>
      <Link to="/" className="logo">
        <i className="bx bx-home"></i>SusanatiendaBogotá
      </Link>

      <ul className="navlist">
        <li>
          <Link 
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link 
            to="/catalogo"
            className={location.pathname === "/catalogo" ? "active" : ""}
          >
            Catálogo
          </Link>
        </li>

        <li>
          <Link 
            to="/tienda"
            className={location.pathname === "/tienda" ? "active" : ""}
          >
            Tienda
          </Link>
        </li>

        <li>
          <a 
            href="#reviews"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                handleScroll("reviews");
              } else {
                window.location.href = "/#reviews";
              }
            }}
          >
            Clientes
          </a>
        </li>
        <li>
          <a 
            href="#contact"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                handleScroll("contact");
              } else {
                window.location.href = "/#contact";
              }
            }}
          >
            Contactar
          </a>
        </li>
        
        {/* 🔧 Enlace de Admin - Solo visible para administradores */}
        {isAuthenticated && isAdmin && (
          <li>
            <Link 
              to="/admin"
              className={location.pathname === "/admin" ? "active" : ""}
            >
              Admin
            </Link>
          </li>
        )}
      </ul>

      <div className="nav-icons">
        {/* 🛒 Botón del Carrito */}
        <button
          onClick={() => {
            console.log('Click en carrito, abriendo...');
            setIsCartOpen(true);
          }}
          type="button"
          className="cart-btn"
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            marginRight: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className="bx bx-cart" style={{ fontSize: '28px', color: 'var(--text-color)' }}></i>
          {itemCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: '#ec4899',
                color: 'white',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                border: '2px solid black'
              }}
            >
              {itemCount}
            </span>
          )}
        </button>

        {!isAuthenticated ? (
          <Link to="/login">
            <i className="bx bx-user"></i>
          </Link>
        ) : (
          <button 
            onClick={handleLogout} 
            className="btn" 
            style={{ 
              padding: '10px 20px', 
              fontSize: '14px',
              marginRight: '10px'
            }}
          >
            Cerrar Sesión
          </button>
        )}
        <div className="bx bx-menu" id="menu-icon"></div>
      </div>
    </header>
  );
}