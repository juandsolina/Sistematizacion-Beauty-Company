document.getElementById("producto-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("producto-id").value; // Identificar si es edición
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const imagenInput = document.getElementById("imagen");

    const formData = new FormData();
    formData.append("id", id); // Si es 0, se creará un nuevo producto
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);

    if (imagenInput.files.length > 0) {
        formData.append("imagen", imagenInput.files[0]);
    }

    try {
        const response = await fetch("productos.php", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        console.log(result);

        if (result.message) {
            alert(id ? "Producto actualizado correctamente!" : "Producto agregado correctamente!");
        } else {
            alert("Error al guardar producto.");
        }

        document.getElementById("producto-form").reset();
        document.getElementById("producto-id").value = "";
        cargarProductos();
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al conectar con el servidor.");
    }
});

// Cargar productos desde la base de datos
async function cargarProductos() {
    try {
        const response = await fetch("productos.php");
        const productos = await response.json();

        let tbody = document.getElementById("productos-lista");
        tbody.innerHTML = "";

        productos.forEach((producto) => {
            let row = `<tr>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>$${producto.precio}</td>
                <td><img src="uploads/${producto.imagen}" width="50"></td>
                <td>
                    <button class="btn editar" onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="btn eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// Función para eliminar un producto
async function eliminarProducto(id) {
    try {
        const response = await fetch("productos.php", {
            method: "DELETE",
            body: JSON.stringify({ id }),
            headers: { "Content-Type": "application/json" }
        });

        const result = await response.json();
        alert(result.message);
        cargarProductos();
    } catch (error) {
        console.error("Error al eliminar producto:", error);
    }
}

// Función para editar un producto
async function editarProducto(id) {
    try {
        const response = await fetch(`productos.php?id=${id}`);
        const producto = await response.json();

        document.getElementById("producto-id").value = producto.id;
        document.getElementById("nombre").value = producto.nombre;
        document.getElementById("descripcion").value = producto.descripcion;
        document.getElementById("precio").value = producto.precio;

        // Desplazar la vista al formulario de edición
        document.getElementById("producto-form").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
        console.error("Error al cargar el producto:", error);
    }
}

// Cargar productos al abrir la página
document.addEventListener("DOMContentLoaded", cargarProductos);
