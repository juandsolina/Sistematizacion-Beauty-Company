document.getElementById("producto-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const idInput = document.getElementById("producto-id") as HTMLInputElement;
  const nombreInput = document.getElementById("nombre") as HTMLInputElement;
  const descripcionInput = document.getElementById("descripcion") as HTMLInputElement;
  const precioInput = document.getElementById("precio") as HTMLInputElement;
  const imagenInput = document.getElementById("imagen") as HTMLInputElement;

  if (!idInput || !nombreInput || !descripcionInput || !precioInput || !imagenInput) {
    alert('Formulario incompleto.');
    return;
  }

  const id = idInput.value;
  const nombre = nombreInput.value.trim();
  const descripcion = descripcionInput.value.trim();
  const precio = precioInput.value.trim();

  const formData = new FormData();
  formData.append("id", id || "0");
  formData.append("nombre", nombre);
  formData.append("descripcion", descripcion);
  formData.append("precio", precio);

  if (imagenInput.files && imagenInput.files.length > 0 && imagenInput.files[0]) {
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

    (document.getElementById("producto-form") as HTMLFormElement)?.reset();
    idInput.value = "";
    cargarProductos();
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al conectar con el servidor.");
  }
});


async function cargarProductos() {
  try {
    const response = await fetch("productos.php");
    const productos = await response.json();

    const tbody = document.getElementById("productos-lista");
    if (!tbody) return;
    tbody.innerHTML = "";

    productos.forEach((producto: any) => {
      let row = `<tr>
          <td>${producto.nombre}</td>
          <td>${producto.descripcion}</td>
          <td>$${producto.precio}</td>
          <td><img src="uploads/${producto.imagen}" width="50" alt="${producto.nombre}"></td>
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

async function eliminarProducto(id: number) {
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

async function editarProducto(id: number) {
  try {
    const response = await fetch(`productos.php?id=${encodeURIComponent(id)}`);
    const producto = await response.json();

    const idInput = document.getElementById("producto-id") as HTMLInputElement;
    const nombreInput = document.getElementById("nombre") as HTMLInputElement;
    const descripcionInput = document.getElementById("descripcion") as HTMLInputElement;
    const precioInput = document.getElementById("precio") as HTMLInputElement;

    if (!idInput || !nombreInput || !descripcionInput || !precioInput) return;

    idInput.value = producto.id;
    nombreInput.value = producto.nombre;
    descripcionInput.value = producto.descripcion;
    precioInput.value = producto.precio;

    document.getElementById("producto-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Error al cargar el producto:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});
