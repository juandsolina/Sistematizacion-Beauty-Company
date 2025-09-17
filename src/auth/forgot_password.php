<?php
header("Content-Type: application/json");

// 🔹 Usamos la conexión centralizada
require_once __DIR__ . "/../config/conexion.php";

// Verificar que se recibió el email
if (!isset($_POST["email"]) || empty($_POST["email"])) {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Debe ingresar un correo."
    ]);
    exit;
}

$email = trim($_POST["email"]);

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Formato de correo inválido."
    ]);
    exit;
}

// Buscar el usuario en la tabla
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // ✅ Usuario encontrado
    echo json_encode([
        "status" => "success",
        "mensaje" => "Correo válido, continúe con el proceso de recuperación."
    ]);
} else {
    // ❌ Usuario no encontrado
    echo json_encode([
        "status" => "error",
        "mensaje" => "Correo no registrado."
    ]);
}

$stmt->close();
$conn->close();
