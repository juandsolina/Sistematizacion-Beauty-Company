// frontend/src/pages/Tienda.tsx
import React, { useEffect, useState } from "react";
import { getProductos } from "../services/catalogo";
import { resolveImageUrl } from "../services/script";
import { useCart } from "../context/CartContext";
import "../styles/tienda.css";

type Producto = {
  id: string | number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  imagen?: string | null;
  categoria?: string | null;
  stock?: number | null;
};

export default function Tienda() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ AHORA useCart() está dentro del componente
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const data = await getProductos();
        setProductos(data.data || data);
      } catch (err: any) {
        setError(err.message || "Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = (p: Producto) => {
    const id = typeof p.id === "string" ? Number(p.id) : p.id;
    
    addToCart(
      {
        id,
        nombre: p.nombre,
        precio: p.precio,
        imagen: p.imagen ?? null,
      },
      1
    );
    
    setIsCartOpen(true);
    console.log("CLICK addToCart:", { id, nombre: p.nombre, precio: p.precio });
    console.log("LS:", JSON.parse(localStorage.getItem("sb_cart_v1") || "[]"));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-300">
        Cargando productos...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 mt-10">Error: {error}</div>;
  }

  return (
    <section className="tienda-wrap">
      <h1 className="tienda-h1">Nuestra Tienda</h1>

      {productos.length === 0 ? (
        <p className="text-center text-gray-400">No hay productos disponibles por el momento.</p>
      ) : (
        <div className="tienda-grid">
          {productos.map((p) => {
            const imgSrc = resolveImageUrl(p.imagen || undefined);
            const hayStock = (p.stock ?? 0) > 0;

            return (
              <article key={String(p.id)} className="tienda-card">
                <div className="tienda-media">
                  <img
                    src={imgSrc}
                    alt={p.nombre}
                    className="tienda-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                </div>

                <div className="tienda-body">
                  <h2 className="tienda-title">{p.nombre}</h2>
                  <p className="tienda-desc">{p.descripcion || "Producto sin descripción."}</p>

                  <div className="tienda-foot">
                    <span className="tienda-price">${p.precio.toFixed(2)}</span>
                    <button
                      type="button"
                      className={`tienda-btn ${hayStock ? "ok" : "off"}`}
                      disabled={!hayStock}
                      onClick={() => hayStock && handleAdd(p)}
                    >
                      {hayStock ? "Agregar al carrito" : "Agotado"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}