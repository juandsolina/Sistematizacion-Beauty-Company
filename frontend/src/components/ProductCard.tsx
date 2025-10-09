export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string | null;
  imagen?: string | null;
  stock: number;
}

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="product-card">
      <img src={p.imagen || "/assets/placeholder.png"} alt={p.nombre} />
      <h4>{p.nombre}</h4>
      <p>${p.precio.toFixed(2)}</p>
    </article>
  );
}
