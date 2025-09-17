<?php
header("Content-Type: application/json");

// ⚠️ Conexión para Docker
$servername = "db";       // nombre del servicio en docker-compose
$username   = "user";     // MYSQL_USER
$password   = "pass123";  // MYSQL_PASSWORD
$dbname     = "tienda";   // MYSQL_DATABASE

// Conectar a MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "mensaje" => "Error en la conexión: " . $conn->connect_error]));
}

// 📌 Obtener datos (JSON o form-data)
$input = json_decode(file_get_contents("php://input"), true);

$email    = $input["email"]    ?? ($_POST["email"]    ?? "");
$nombre   = $input["nombre"]   ?? ($_POST["nombre"]   ?? ($_POST["username"] ?? "")); // alias username->nombre
$password_input = $input["password"] ?? ($_POST["password"] ?? "");
$rol      = $input["rol"]      ?? ($_POST["rol"]      ?? "cliente"); // por defecto cliente

// Validación simple
if (empty($email) || empty($nombre) || empty($password_input)) {
    echo json_encode(["status" => "error", "mensaje" => "Todos los campos son requeridos."]);
    exit();
}

// Verificar si el correo ya está registrado
$sql_check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$sql_check->bind_param("s", $email);
$sql_check->execute();
$sql_check->store_result();

if ($sql_check->num_rows > 0) {
    echo json_encode(["status" => "error", "mensaje" => "El correo ya está registrado."]);
    $sql_check->close();
    $conn->close();
    exit();
}
$sql_check->close();

// Encriptar contraseña con bcrypt
$password_hashed = password_hash($password_input, PASSWORD_BCRYPT);

// Insertar usuario
$sql = $conn->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)");
$sql->bind_param("ssss", $nombre, $email, $password_hashed, $rol);

if ($sql->execute()) {
    echo json_encode([
        "status" => "success",
        "mensaje" => "Registro exitoso",
        "usuario" => [
            "id" => $sql->insert_id,
            "nombre" => $nombre,
            "email" => $email,
            "rol" => $rol
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "mensaje" => "Error al registrar usuario: " . $conn->error]);
}

$sql->close();
$conn->close();
?>
