<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "tienda"; // o el nombre exacto de tu BD

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("❌ Error de conexión: " . $conn->connect_error);
} else {
    echo "✅ Conexión exitosa a la base de datos";
}
?>
