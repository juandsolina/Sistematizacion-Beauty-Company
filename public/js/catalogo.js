document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

function cargarProductos() {
    fetch("productos.php")
        .then(response => response.json())
        .then(productos => {
            console.log("✅ Productos recibidos:", productos);

            const contenedor = document.getElementById("productos");
            contenedor.innerHTML = "";

            if (!productos.length) {
                contenedor.innerHTML = "<p>No hay productos disponibles.</p>";
                return;
            }

            productos.forEach(producto => {
                const productoHTML = `
                    <div class="producto">
                        <img src="${producto.imagen || 'https://via.placeholder.com/200'}" 
                             alt="${producto.nombre}" 
                             class="producto-imagen">

                        <h2>${producto.nombre}</h2>
                        <p class="precio">$${Number(producto.precio).toLocaleString()}</p>
                        <p>${producto.descripcion}</p>

                        <a href="carrito.php?id=${producto.id}" class="btn">Agregar al carrito</a>
                    </div>
                `;
                contenedor.insertAdjacentHTML("beforeend", productoHTML);
            });
        })
        .catch(error => {
            console.error("❌ Error al obtener productos:", error);
            document.getElementById("productos").innerHTML =
                "<p style='color:red;'>Error al cargar los productos.</p>";
        });
}
