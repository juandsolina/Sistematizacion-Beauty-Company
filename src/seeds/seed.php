<?php
// Usuarios iniciales
$usuarios = [
    ["Administrador", "admin@tienda.com", "admin123", "admin"],
    ["Cliente 1", "cliente1@tienda.com", "cliente123", "cliente"],
    ["Cliente 2", "cliente2@tienda.com", "cliente123", "cliente"]
];

// Configuración de la base de datos
$servername = "db";
$username   = "user";
$password   = "pass123";
$dbname     = "tienda";

// Esperar a que MySQL esté listo
$tries = 0;
do {
    $conn = @new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        echo "⏳ Esperando MySQL...\n";
        sleep(2);
        $tries++;
    } else {
        break;
    }
} while ($tries < 10);

if ($conn->connect_error) {
    die("❌ Error de conexión final: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

// Insertar usuarios solo si no existen
foreach ($usuarios as $u) {
    [$nombre, $email, $pass, $rol] = $u;

    // Verificar si el usuario ya existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo "ℹ️ Usuario $email ya existe, se omite.\n";
    } else {
        $hash = password_hash($pass, PASSWORD_BCRYPT);
        $stmtInsert = $conn->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)");
        $stmtInsert->bind_param("ssss", $nombre, $email, $hash, $rol);
        $stmtInsert->execute();
        echo "✅ Usuario $email insertado correctamente.\n";
        $stmtInsert->close();
    }

    $stmt->close();
}

$conn->close();
echo "🎉 Seed completado.\n";
