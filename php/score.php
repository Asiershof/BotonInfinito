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

// Verificar que la petición sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos JSON enviados desde el frontend
    $data = json_decode(file_get_contents('php://input'), true);

    // Extraer nombre y puntuación del JSON
    $nombre = $data['nombre'];
    $puntuacion = $data['puntuacion'];

    // Asegurarse de que los datos no estén vacíos
    if (!empty($nombre) && !empty($puntuacion)) {
        // Usar "INSERT ... ON DUPLICATE KEY UPDATE" para actualizar la puntuación si el nombre ya existe
        $stmt = $conn->prepare("INSERT INTO tabla_puntuaciones (nombre, puntuacion) VALUES (?, ?) 
                                ON DUPLICATE KEY UPDATE puntuacion = GREATEST(puntuacion, VALUES(puntuacion))");
        $stmt->bind_param("si", $nombre, $puntuacion);

        if ($stmt->execute()) {
            // Devolver un mensaje de éxito al frontend
            echo json_encode(["message" => "Puntuación actualizada o insertada con éxito"]);
        } else {
            // Si ocurre un error, devolver un mensaje de error
            echo json_encode(["message" => "Error al guardar la puntuación"]);
        }

        $stmt->close();
    } else {
        // Si los datos están vacíos, devolver un error
        echo json_encode(["message" => "Datos incompletos"]);
    }
} else {
    // Si no es una petición POST, devolver un mensaje de error
    echo json_encode(["message" => "Método no permitido"]);
}

// Cerrar la conexión
$conn->close();
?>
