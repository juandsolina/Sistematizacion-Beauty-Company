<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "db"; // dentro de Docker, apunta al servicio "db"
$user = "user";
$pass = "pass123";
$dbname = "tienda";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

// Obtener productos (uno o todos)
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (isset($_GET["id"])) {
        $id = intval($_GET["id"]);
        $stmt = $conn->prepare("SELECT * FROM productos WHERE id = ?");
        $stmt->bind_param("i", $id);
    } else {
        $stmt = $conn->prepare("SELECT * FROM productos");
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $productos = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($productos);
    $stmt->close();
    exit();
}

// Agregar o actualizar producto
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = isset($_POST["id"]) ? intval($_POST["id"]) : 0;
    $nombre = $_POST["nombre"] ?? "";
    $descripcion = $_POST["descripcion"] ?? "";
    $precio = isset($_POST["precio"]) ? floatval($_POST["precio"]) : 0.0;
    $stock = isset($_POST["stock"]) ? intval($_POST["stock"]) : 0;

    // Manejo de imagen
    if (!empty($_FILES["imagen"]["name"])) {
        $imagenNombre = time() . "_" . basename($_FILES["imagen"]["name"]);
        $imagenRuta = "uploads/" . $imagenNombre;
        move_uploaded_file($_FILES["imagen"]["tmp_name"], $imagenRuta);
    } else {
        $imagenRuta = $id > 0 ? obtenerImagenActual($conn, $id) : "";
    }

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, imagen=? WHERE id=?");
        $stmt->bind_param("ssdisi", $nombre, $descripcion, $precio, $stock, $imagenRuta, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdss", $nombre, $descripcion, $precio, $stock, $imagenRuta);
    }

    echo json_encode(["message" => $stmt->execute() ? "Producto guardado correctamente" : "Error al guardar producto"]);
    $stmt->close();
    exit();
}

// Eliminar producto
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data["id"])) {
        echo json_encode(["error" => "ID no proporcionado"]);
        exit();
    }

    $id = intval($data["id"]);
    $stmt = $conn->prepare("DELETE FROM productos WHERE id = ?");
    $stmt->bind_param("i", $id);

    echo json_encode(["message" => $stmt->execute() ? "Producto eliminado correctamente" : "Error al eliminar producto"]);
    $stmt->close();
    exit();
}

// Función para obtener la imagen actual de un producto
function obtenerImagenActual($conn, $id) {
    $imagen = "";
    $stmt = $conn->prepare("SELECT imagen FROM productos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $imagen = $row["imagen"];
    }

    $stmt->close();
    return $imagen;
}

$conn->close();
?>
