<?php
$host = "mysql-db";   // nombre del servicio en docker-compose
$user = "user";       // el que definiste en docker-compose
$pass = "pass123";    // contraseña del usuario
$dbname = "tienda";   // nombre de la base definida en docker-compose

// Crear conexión
$conn = new mysqli($host, $user, $pass, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("❌ Conexión fallida: " . $conn->connect_error);
}

// Establecer el conjunto de caracteres a utf8mb4
$conn->set_charset("utf8mb4");

// ✅ Solo para pruebas
// echo "✅ Conectado correctamente a la base de datos";
?>
