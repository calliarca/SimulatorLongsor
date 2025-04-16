<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Koneksi ke database MySQL
$servername = "localhost";
$username = "root"; // Ganti dengan username MySQL Anda
$password = ""; // Ganti dengan password MySQL Anda
$dbname = "simulator_longsor";

// Buat koneksi ke database
$conn = new mysqli($servername, $username, $password, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Ambil data dari request POST
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// Validasi data JSON
if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON data"]);
    exit;
}

// Pastikan semua field ada
if (
    !isset($data['simulationName']) ||
    !isset($data['kelembabanTanah']) ||
    !isset($data['derajatKemiringan']) ||
    !isset($data['curahHujan'])
) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

// Sanitasi & konversi data
$simulationName = trim($data['simulationName']);
$kelembabanTanah = floatval($data['kelembabanTanah']);
$derajatKemiringan = floatval($data['derajatKemiringan']);
$curahHujan = floatval($data['curahHujan']);

// Gunakan Prepared Statement untuk keamanan
$sql = "INSERT INTO simulations (simulation_name, kelembaban_tanah, derajat_kemiringan, curah_hujan, created_at) 
        VALUES (?, ?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sddd", $simulationName, $kelembabanTanah, $derajatKemiringan, $curahHujan);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Simulation saved successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
