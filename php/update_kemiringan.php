<?php
date_default_timezone_set("Asia/Jakarta");

// Koneksi ke database
$host = "localhost";
$user = "root";
$pass = "";
$db = "simulator_longsor";

$koneksi = new mysqli($host, $user, $pass, $db);
if ($koneksi->connect_error) {
    die("Koneksi gagal: " . $koneksi->connect_error);
}

// Ambil data terbaru dari ThingSpeak
$url = "https://api.thingspeak.com/channels/2889619/fields/2.json?results=1";
$response = file_get_contents($url);
$data = json_decode($response, true);

if (isset($data['feeds'][0]['field2']) && $data['feeds'][0]['field2'] !== null) {
    $kemiringan = floatval($data['feeds'][0]['field2']);
    $waktu = date("Y-m-d H:i:s", strtotime($data['feeds'][0]['created_at']));

    // Cek apakah data dengan waktu itu sudah ada
    $cek = $koneksi->query("SELECT * FROM sensor_kemiringan WHERE waktu = '$waktu'");
    if ($cek->num_rows == 0) {
        // Simpan ke database
        $koneksi->query("INSERT INTO sensor_kemiringan (output_kemiringan, waktu) VALUES ($kemiringan, '$waktu')");
        echo "Data berhasil disimpan: $kemiringan pada $waktu\n";
    } else {
        echo "Data sudah ada di database. Tidak disimpan ulang.\n";
    }
} else {
    echo "Tidak ada data kemiringan dari ThingSpeak.\n";
}
?>
