<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Catálogo de Productos</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .productos {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
        .producto {
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 15px;
            width: 250px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            text-align: center;
        }
        .producto img {
            max-width: 200px;
            height: auto;
            margin-bottom: 10px;
            border-radius: 5px;
        }
        .precio {
            font-weight: bold;
            color: #28a745;
            font-size: 1.2em;
        }
    </style>
</head>
<body>
    <h1>Catálogo de Productos</h1>
    <div class="productos" id="lista-productos">
        <p>Cargando productos...</p>
    </div>

    <script>
        async function cargarProductos() {
            try {
                const respuesta = await fetch("api_productos.php");
                const productos = await respuesta.json();
                const contenedor = document.getElementById("lista-productos");

                contenedor.innerHTML = ""; // limpiar "Cargando..."

                if (productos.length === 0) {
                    contenedor.innerHTML = "<p>No hay productos disponibles.</p>";
                    return;
                }

                productos.forEach(prod => {
                    const div = document.createElement("div");
                    div.className = "producto";
                    div.innerHTML = `
                        <img src="${prod.imagen}" alt="${prod.nombre}">
                        <h3>${prod.nombre}</h3>
                        <p>${prod.descripcion}</p>
                        <p class="precio">$${parseFloat(prod.precio).toFixed(2)}</p>
                    `;
                    contenedor.appendChild(div);
                });
            } catch (error) {
                console.error("Error cargando productos:", error);
                document.getElementById("lista-productos").innerHTML =
                    "<p>Error al cargar productos.</p>";
            }
        }

        cargarProductos();
    </script>
</body>
</html>
