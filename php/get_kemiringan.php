<?php
$koneksi = new mysqli("localhost", "root", "", "simulator_longsor");

if ($koneksi->connect_error) {
    die("Koneksi gagal: " . $koneksi->connect_error);
}

$sql = "SELECT output_kemiringan FROM sensor_kemiringan ORDER BY waktu DESC LIMIT 1";
$result = $koneksi->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    echo $row['output_kemiringan'];
} else {
    echo "--";
}

$koneksi->close();
?>
