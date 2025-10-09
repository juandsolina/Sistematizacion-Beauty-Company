import { Link } from "react-router-dom";
import { useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export default function Catalogo() {
  const [productos] = useState<Producto[]>([
    {
      id: 1,
      nombre: "Toallitas uñas",
      descripcion: "Toallitas de uñas hechas de tela no tejida, suave y sin pelusas.",
      precio: 6000,
      imagen: "/Toallitas.png",
    },
    {
      id: 2,
      nombre: "Ollita de cera",
      descripcion: "Olla calentadora de cera siliconada, fácil de limpiar.",
      precio: 35000,
      imagen: "/ollita-de-cera.png",
    },
    {
      id: 3,
      nombre: "Pulidor de mesa",
      descripcion: "Pulidora de uñas profesional de 35.000 RPM.",
      precio: 100000,
      imagen: "/pulidor.png",
    },
    {
      id: 4,
      nombre: "Papel Cuellero",
      descripcion: "Tira de papel desechable para cuello, accesorio profesional.",
      precio: 11000,
      imagen: "/Cuellero.png",
    },
  ]);

  const handleAddToCart = (producto: Producto) => {
    alert(`${producto.nombre} agregado al carrito`);
  };

  return (
    <div className="catalogo-page">
      {/* Espaciador para alejar del header */}
      <div style={{ height: "400px" }} />

      <div className="catalogo-wrap">
        {/* Hero Section */}
        <section className="catalogo-hero">
          <div className="catalogo-hero-content">
            <h4>SusanaTiendaBogotá</h4>
            <h1>Bienvenido(a) al catálogo</h1>
            <Link to="/admin/productos" className="btn-agregar">
              Agregar productos ▶
            </Link>
          </div>
        </section>

        {/* Products Grid */}
        <section className="catalogo-products">
          <div className="products-grid">
            {productos.map((producto) => (
              <div key={producto.id} className="product-card">
                <div className="product-image">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                </div>
                <div className="product-info">
                  <h3>{producto.nombre}</h3>
                  <p className="tienda-desc">{producto.descripcion}</p>
                  <div className="product-price">
                    ${producto.precio.toLocaleString("es-CO")}
                  </div>
                  <button
                    className="btn-add-cart"
                    onClick={() => handleAddToCart(producto)}
                  >
                    Ordenar ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back to Home Button */}
        <section className="catalogo-footer">
          <Link to="/" className="btn-volver">
            Volver a la página principal ▶
          </Link>
        </section>
      </div>
    </div>
  );
}