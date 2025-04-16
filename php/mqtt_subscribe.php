<?php
// Muat file phpMQTT.php
$file = __DIR__ . "/phpMQTT.php";
if (!file_exists($file)) {
    die("❌ File phpMQTT.php tidak ditemukan di: $file");
}

require_once $file;
echo "✅ File phpMQTT.php berhasil dimuat!\n";

if (!class_exists('Bluerhinos\phpMQTT')) {
    die("❌ Class Bluerhinos\phpMQTT masih tidak ditemukan!");
} else {
    echo "✅ Class Bluerhinos\phpMQTT berhasil dimuat!\n";
}

// Konfigurasi MQTT ThingSpeak
$server    = "mqtt3.thingspeak.com";  
$port      = 1883;
$client_id = "NjUSADEdNjg8CBUjDCAuBDc"; // Tetap gunakan client ID yang sebelumnya
$username  = "NjUSADEdNjg8CBUjDCAuBDc";
$password  = "M8jZfJ0gGlo10ayuTioey9hm";
$channelID = "2843704";
$mqtt_topic = "channels/$channelID/subscribe/json";

// Koneksi ke database MySQL
$mysqli = new mysqli("localhost", "root", "", "simulator_longsor");
if ($mysqli->connect_error) {
    die("❌ Koneksi ke database gagal: " . $mysqli->connect_error);
}

$mqtt = new Bluerhinos\phpMQTT($server, $port, $client_id);

if (!$mqtt->connect(true, NULL, $username, $password)) {
    die("❌ Koneksi ke MQTT Broker gagal!");
}

echo "✅ Terhubung ke MQTT Broker...\n";
echo "📡 Menunggu pesan dari ThingSpeak selama 30 detik...\n";

// Set callback untuk menangani pesan
$mqtt->subscribe([$mqtt_topic => ["qos" => 0, "function" => "procmsg"]]);

// Jalankan loop selama 30 detik agar pesan bisa diterima
$start_time = time();
while (time() - $start_time < 30 && $mqtt->proc()) {
    // Loop berjalan
}
$mqtt->close();
echo "🔒 Koneksi MQTT ditutup.\n";

// Fungsi untuk menyimpan data ke database
function procmsg($topic, $message) {
    global $mysqli;
    echo "📥 Data diterima dari $topic: $message\n";
    
    // Decode JSON dari ThingSpeak
    $data = json_decode($message, true);
    if (!$data) {
        echo "❌ Error: JSON tidak valid\n";
        return;
    }
    
    // Ambil data dari JSON
    $field1 = isset($data["field1"]) ? floatval($data["field1"]) : 0;
    $field2 = isset($data["field2"]) ? floatval($data["field2"]) : 0;
    $field3 = isset($data["field3"]) ? floatval($data["field3"]) : 0;
    $field4 = isset($data["field4"]) ? floatval($data["field4"]) : 0;
    $field5 = isset($data["field5"]) ? floatval($data["field5"]) : 0;
    $field6 = isset($data["field6"]) ? floatval($data["field6"]) : 0;
    
    // Simpan data ke database menggunakan prepared statement
    $stmt = $mysqli->prepare("INSERT INTO kelembaban_tanah (sensor1, sensor2, sensor3, sensor4, sensor5, sensor6) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("dddddd", $field1, $field2, $field3, $field4, $field5, $field6);
    
    if ($stmt->execute()) {
        echo "✅ Data berhasil disimpan: $field1, $field2, $field3, $field4, $field5, $field6\n";
    } else {
        echo "❌ Error: " . $stmt->error . "\n";
    }
    $stmt->close();
}

// Setelah proses subscribe, tampilkan data yang tersimpan dari database
$query = "SELECT * FROM kelembaban_tanah ORDER BY timestamp DESC LIMIT 20";
$result = $mysqli->query($query);
?>