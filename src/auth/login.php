<?php
header("Content-Type: application/json");

// ⚠️ Ajusta conexión para Docker
$servername = "db";       // nombre del servicio en docker-compose
$username   = "user";     // usuario definido en MYSQL_USER
$password   = "pass123";  // contraseña definida en MYSQL_PASSWORD
$dbname     = "tienda";   // base de datos definida en MYSQL_DATABASE

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "mensaje" => "Error en la conexión: " . $conn->connect_error]));
}

// 📌 Obtener datos (aceptar JSON o form-data)
$input = json_decode(file_get_contents("php://input"), true);

$email = $input["email"] ?? ($_POST["email"] ?? "");
$password_input = $input["password"] ?? ($_POST["password"] ?? "");

// Validación simple
if (empty($email) || empty($password_input)) {
    echo json_encode(["status" => "error", "mensaje" => "Email y contraseña son requeridos."]);
    exit();
}

// Buscar usuario por email
$sql = $conn->prepare("SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?");
$sql->bind_param("s", $email);
$sql->execute();
$result = $sql->get_result();

if ($result->num_rows === 1) {
    $usuario = $result->fetch_assoc();

    // ✅ Comparación directa (sin password_verify)
    if ($password_input === $usuario["password"]) {
        echo json_encode([
            "status" => "success",
            "mensaje" => "Login exitoso",
            "usuario" => [
                "id" => $usuario["id"],
                "nombre" => $usuario["nombre"],
                "email" => $usuario["email"],
                "rol" => $usuario["rol"]
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Contraseña incorrecta."]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "Usuario no encontrado."]);
}

$sql->close();
$conn->close();
?>
