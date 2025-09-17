<?php
$servername = "db";       // nombre del servicio MySQL en docker-compose
$username   = "user";     // definido en MYSQL_USER
$password   = "pass123";  // definido en MYSQL_PASSWORD
$dbname     = "tienda";   // definido en MYSQL_DATABASE

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("❌ Error de conexión: " . $conn->connect_error);
}

// Usuarios iniciales
$usuarios = [
    ["Administrador", "admin@tienda.com", "admin123", "admin"],
    ["Cliente 1", "cliente1@tienda.com", "cliente123", "cliente"],
    ["Cliente 2", "cliente2@tienda.com", "cliente123", "cliente"]
];

foreach ($usuarios as $u) {
    $hash = password_hash($u[2], PASSWORD_BCRYPT);
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $u[0], $u[1], $hash, $u[3]);
    if ($stmt->execute()) {
        echo "✅ Usuario {$u[1]} insertado correctamente\n";
    } else {
        echo "⚠️ Error al insertar {$u[1]}: " . $stmt->error . "\n";
    }
}

echo "🎉 Seed completado con éxito.\n";
$conn->close();
