<?php
header("Content-Type: text/plain; charset=utf-8");

// Ajusta conexión para Docker
$servername = "db";
$username   = "user";
$password   = "pass123";
$dbname     = "tienda";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("❌ Error de conexión: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");

// Usuario a probar
$email = "admin@tienda.com";
$plain = "admin123";

// Buscar usuario
$stmt = $conn->prepare("SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "⚠️ Usuario no encontrado: $email\n";
} else {
    $u = $result->fetch_assoc();
    echo "🔎 Usuario encontrado:\n";
    print_r($u);

    // Verificar contraseña
    if (password_verify($plain, $u['password'])) {
        echo "\n✅ La contraseña $plain ES correcta para $email\n";
    } else {
        echo "\n❌ La contraseña $plain NO coincide con el hash guardado\n";
    }
}

$stmt->close();
$conn->close();
