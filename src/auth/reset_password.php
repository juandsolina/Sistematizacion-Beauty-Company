<?php
header("Content-Type: application/json");

// 🔹 Conexión centralizada
require_once __DIR__ . "/../config/conexion.php";

// Datos recibidos
$email = $_POST["email"] ?? "";
$newPassword = $_POST["newPassword"] ?? "";

if (empty($email) || empty($newPassword)) {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Faltan datos obligatorios."
    ]);
    exit;
}

// Encriptar la nueva contraseña (bcrypt recomendado)
$password_encrypted = password_hash($newPassword, PASSWORD_BCRYPT);

// Verificar si el usuario existe
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Correo no encontrado."
    ]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Actualizar contraseña
$updateStmt = $conn->prepare("UPDATE usuarios SET password = ? WHERE email = ?");
$updateStmt->bind_param("ss", $password_encrypted, $email);

if ($updateStmt->execute()) {
    echo json_encode([
        "status" => "success",
        "mensaje" => "Contraseña actualizada correctamente."
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al actualizar contraseña."
    ]);
}

$updateStmt->close();
$conn->close();
