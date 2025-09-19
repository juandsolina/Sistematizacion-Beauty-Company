document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});

interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
}

function cargarProductos(): void {
  fetch("productos.php")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((productos: Producto[]) => {
      console.log("✅ Productos recibidos:", productos);

      const contenedor = document.getElementById("productos");
      if (!contenedor) return;
      contenedor.innerHTML = "";

      if (!productos.length) {
        contenedor.innerHTML = "<p>No hay productos disponibles.</p>";
        return;
      }

      productos.forEach(producto => {
        const productoHTML = `
          <div class="producto">
            <img src="${producto.imagen ?? 'https://via.placeholder.com/200'}" 
                 alt="${producto.nombre}" 
                 class="producto-imagen">
            <h2>${producto.nombre}</h2>
            <p class="precio">$${producto.precio.toLocaleString()}</p>
            <p>${producto.descripcion ?? ''}</p>
            <a href="carrito.php?id=${encodeURIComponent(producto.id)}" class="btn">Agregar al carrito</a>
          </div>
        `;
        contenedor.insertAdjacentHTML("beforeend", productoHTML);
      });
    })
    .catch(error => {
      console.error("❌ Error al obtener productos:", error);
      const contenedor = document.getElementById("productos");
      if (contenedor) {
        contenedor.innerHTML = "<p style='color:red;'>Error al cargar los productos.</p>";
      }
    });
}
interface CartEntry {
  qty: number;
  nombre?: string;
  precio?: number;
  img?: string;
}