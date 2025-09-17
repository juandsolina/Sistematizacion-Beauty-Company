<?php
session_start();
if (!isset($_SESSION["usuario_id"]) || $_SESSION["rol"] !== "admin") {
    header("Location: ../login.html");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel de Administración</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            display: flex;
            height: 100vh;
            background: #f4f6f9;
        }
        aside {
            width: 220px;
            background: #2c3e50;
            color: white;
            padding: 20px;
        }
        aside h2 { margin-bottom: 20px; }
        aside ul { list-style: none; }
        aside ul li { margin: 15px 0; }
        aside ul li a {
            color: white;
            text-decoration: none;
            display: block;
            padding: 8px;
            border-radius: 6px;
        }
        aside ul li a:hover { background: #34495e; }
        main {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }
        h1 { margin-bottom: 15px; color: #333; }

        /* Tarjetas estadísticas */
        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            text-align: center;
            font-weight: bold;
            color: #2c3e50;
        }

        /* Formulario */
        .formulario {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            max-width: 600px;
        }
        .formulario label { font-weight: bold; margin-top: 10px; display: block; }
        .formulario input, .formulario textarea {
            width: 100%; padding: 8px; margin: 5px 0 15px;
            border: 1px solid #ddd; border-radius: 6px;
        }
        .formulario button {
            padding: 10px 15px;
            border: none; border-radius: 6px;
            margin-right: 10px;
            cursor: pointer;
        }
        .formulario button[type="submit"] { background: #27ae60; color: white; }
        .formulario button[type="button"] { background: #95a5a6; color: white; }

        /* Productos */
        .productos h2 { margin-bottom: 15px; }
        #lista-productos {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 20px;
        }
        .producto {
            background: white;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .producto:hover { transform: scale(1.03); }
        .producto img {
            max-width: 120px;
            margin-bottom: 10px;
            border-radius: 6px;
        }
        .producto h3 { margin: 10px 0; color: #2c3e50; }
        .botones button {
            padding: 6px 10px;
            border: none;
            border-radius: 6px;
            margin: 5px;
            cursor: pointer;
        }
        .botones button:first-child { background: #2980b9; color: white; } /* Editar */
        .botones button:last-child { background: #c0392b; color: white; } /* Eliminar */
    </style>
</head>
<body>
    <!-- Sidebar -->
    <aside>
        <h2>Admin Panel</h2>
        <ul>
            <li><a href="#">📦 Productos</a></li>
            <li><a href="#">🛒 Pedidos</a></li>
            <li><a href="#">👥 Usuarios</a></li>
            <li><a href="../auth/logout.php">🚪 Cerrar Sesión</a></li>
        </ul>
    </aside>

    <!-- Contenido -->
    <main>
        <h1>Bienvenido, <?php echo $_SESSION["nombre"]; ?> 👑</h1>

        <!-- Tarjetas -->
        <div class="cards">
            <div class="card">Productos: <span id="totalProductos">0</span></div>
            <div class="card">Pedidos Pendientes: 8</div>
            <div class="card">Usuarios: 54</div>
        </div>

        <!-- Formulario -->
        <div class="formulario">
            <h2 id="form-title">Agregar Producto</h2>
            <form id="productoForm" enctype="multipart/form-data">
                <input type="hidden" name="id" id="id">
                
                <label>Nombre:</label>
                <input type="text" name="nombre" id="nombre" required>

                <label>Descripción:</label>
                <textarea name="descripcion" id="descripcion" required></textarea>

                <label>Precio:</label>
                <input type="number" name="precio" id="precio" step="0.01" required>

                <label>Stock:</label>
                <input type="number" name="stock" id="stock" required>

                <label>Imagen:</label>
                <input type="file" name="imagen" id="imagen">

                <button type="submit">Guardar</button>
                <button type="button" onclick="resetForm()">Cancelar</button>
            </form>
        </div>

        <!-- Lista de productos -->
        <div class="productos">
            <h2>Productos Existentes</h2>
            <div id="lista-productos">Cargando...</div>
        </div>
    </main>

    <script>
        const API_URL = "../controllers/api_productos.php"; // ajusta ruta según tu estructura

        async function cargarProductos() {
            const respuesta = await fetch(API_URL);
            const productos = await respuesta.json();
            const contenedor = document.getElementById("lista-productos");
            contenedor.innerHTML = "";

            if (productos.length === 0) {
                contenedor.innerHTML = "<p>No hay productos disponibles.</p>";
                return;
            }

            document.getElementById("totalProductos").innerText = productos.length;

            productos.forEach(prod => {
                const div = document.createElement("div");
                div.className = "producto";
                div.innerHTML = `
                    <img src="../${prod.imagen}" alt="${prod.nombre}">
                    <h3>${prod.nombre}</h3>
                    <p>${prod.descripcion}</p>
                    <p><strong>Precio:</strong> $${parseFloat(prod.precio).toFixed(2)}</p>
                    <p><strong>Stock:</strong> ${prod.stock}</p>
                    <div class="botones">
                        <button onclick="editarProducto(${prod.id}, '${prod.nombre}', '${prod.descripcion}', ${prod.precio}, ${prod.stock})">Editar</button>
                        <button onclick="eliminarProducto(${prod.id})">Eliminar</button>
                    </div>
                `;
                contenedor.appendChild(div);
            });
        }

        document.getElementById("productoForm").addEventListener("submit", async function(e) {
            e.preventDefault();
            const formData = new FormData(this);

            const respuesta = await fetch(API_URL, {
                method: "POST",
                body: formData
            });

            const resultado = await respuesta.json();
            alert(resultado.message);
            resetForm();
            cargarProductos();
        });

        function editarProducto(id, nombre, descripcion, precio, stock) {
            document.getElementById("form-title").innerText = "Editar Producto";
            document.getElementById("id").value = id;
            document.getElementById("nombre").value = nombre;
            document.getElementById("descripcion").value = descripcion;
            document.getElementById("precio").value = precio;
            document.getElementById("stock").value = stock;
        }

        async function eliminarProducto(id) {
            if (!confirm("¿Seguro que quieres eliminar este producto?")) return;

            const respuesta = await fetch(API_URL, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            const resultado = await respuesta.json();
            alert(resultado.message);
            cargarProductos();
        }

        function resetForm() {
            document.getElementById("form-title").innerText = "Agregar Producto";
            document.getElementById("productoForm").reset();
            document.getElementById("id").value = "";
        }

        cargarProductos();
    </script>
</body>
</html>
