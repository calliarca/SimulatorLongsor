<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Koneksi database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "simulator_longsor";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed"]);
    exit;
}

// Ambil data kemiringan terbaru
$sql = "SELECT output_kemiringan, waktu FROM sensor_kemiringan ORDER BY waktu DESC LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        "status" => "success",
        "output_kemiringan" => floatval($row['output_kemiringan']),
        "timestamp" => $row['waktu']
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "No data found"]);
}

$conn->close();
?>
