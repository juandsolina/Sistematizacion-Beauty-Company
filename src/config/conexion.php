<?php
$host = "db";           // 👈 el nombre del servicio en docker-compose
$user = "user";         // el usuario definido en MYSQL_USER
$pass = "pass123";      // la contraseña definida en MYSQL_PASSWORD
$db   = "tienda";       // la base de datos definida en MYSQL_DATABASE

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("❌ Error de conexión: " . $conn->connect_error);
} else {
    echo "✅ Conexión exitosa a la base de datos.";
}
?>
