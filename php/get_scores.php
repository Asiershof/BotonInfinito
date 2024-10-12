<?php
// Configuración de conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "boton";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Consulta para obtener las 3 mejores puntuaciones
$sql = "SELECT nombre, puntuacion FROM tabla_puntuaciones ORDER BY puntuacion DESC LIMIT 3";
$result = $conn->query($sql);

$top3 = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $top3[] = $row;
    }
}

// Devolver los resultados como JSON
echo json_encode($top3);

$conn->close();
?>