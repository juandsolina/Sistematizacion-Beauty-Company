<?php
require_once __DIR__ . '/../config/conexion.php';

// Datos del administrador
$nombre   = "Administrador";
$email    = "admin@tienda.com";
$password = password_hash("admin123", PASSWORD_BCRYPT);
$rol      = "admin";

// Verificar si ya existe
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo "✅ El usuario administrador ya existe.";
} else {
    // Insertar usuario administrador
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nombre, $email, $password, $rol);

    if ($stmt->execute()) {
        echo "🎉 Usuario administrador creado correctamente. Email: $email | Password: admin123";
    } else {
        echo "❌ Error al crear administrador: " . $stmt->error;
    }
}

$stmt->close();
$conn->close();
?>
