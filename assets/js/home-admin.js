// Deklarasikan variabel di global scope
let toggleSimulation;
let currentKemiringan = 0; // Simpan nilai derajat kemiringan
let currentCurahHujan = 0; // Simpan nilai curah hujan
let currentKelembabanTanah = 22; // Simpan nilai kelembaban tanah

document.addEventListener('DOMContentLoaded', () => {
  toggleSimulation = document.querySelector('#toggle-simulation'); // Inisialisasi variabel
  const simulationPopup = document.querySelector('#simulation-popup');
  const simulationOverlay = document.querySelector('#popup-overlay');
  const saveButton = document.querySelector('#save-simulation-btn');
  const closeButton = document.querySelector('#close-popup-btn');
  const simulationNameInput = document.querySelector('#simulation-name');
  const simulationText = document.querySelector('#simulation-text');
  const kemiringanInput = document.querySelector('#kemiringan-input');
  const curahHujanInput = document.querySelector('#curah-hujan-input');
  const kemiringanButton = document.querySelector('.frame-home-page1-button1');
  const curahHujanButton = document.querySelector('.frame-home-page1-button2'); // Pastikan selector ini sesuai

  // Nonaktifkan input kemiringan dan curah hujan secara default
  if (kemiringanInput) kemiringanInput.disabled = true;
  if (curahHujanInput) curahHujanInput.disabled = true;

  // Event listener untuk input nama simulasi
  simulationNameInput.addEventListener('input', () => {
    const simulationName = simulationNameInput.value.trim();
    if (simulationName) {
      // Aktifkan input dan tombol jika nama simulasi diisi
      if (kemiringanInput) kemiringanInput.disabled = false;
      if (curahHujanInput) curahHujanInput.disabled = false;
      if (kemiringanButton) kemiringanButton.disabled = false;
      if (curahHujanButton) curahHujanButton.disabled = false;
    } else {
      // Nonaktifkan input dan tombol jika nama simulasi kosong
      if (kemiringanInput) kemiringanInput.disabled = true;
      if (curahHujanInput) curahHujanInput.disabled = true;
      if (kemiringanButton) kemiringanButton.disabled = true;
      if (curahHujanButton) curahHujanButton.disabled = true;
    }
  });

  // Event listener untuk checkbox (slider)
  toggleSimulation.addEventListener('change', (event) => {
    if (event.target.checked) {
      simulationPopup.style.display = 'block'; // Tampilkan popup
      simulationOverlay.style.display = 'block'; // Tampilkan overlay

      // Set nilai input ke nilai yang sudah disimpan
      if (kemiringanInput) kemiringanInput.value = currentKemiringan;
      if (curahHujanInput) curahHujanInput.value = currentCurahHujan;
    } else {
      simulationPopup.style.display = 'none'; // Sembunyikan popup
      simulationOverlay.style.display = 'none'; // Sembunyikan overlay
      simulationText.textContent = 'START SIMULATION'; // Reset teks

      // Reset nilai derajat kemiringan dan curah hujan ke 0
      currentKemiringan = 0;
      currentCurahHujan = 0;

      // Reset nilai input
      if (kemiringanInput) kemiringanInput.value = currentKemiringan;
      if (curahHujanInput) curahHujanInput.value = currentCurahHujan;
    }
  });

  // Pengecekan jika elemen kemiringan ada
  if (kemiringanInput) {
    kemiringanInput.addEventListener('input', (event) => {
      currentKemiringan = parseFloat(event.target.value); // Update currentKemiringan
    });
  }

  // Pengecekan jika elemen curah hujan ada
  if (curahHujanInput) {
    curahHujanInput.addEventListener('input', (event) => {
      currentCurahHujan = parseFloat(event.target.value); // Update currentCurahHujan
    });
  }

  saveButton.addEventListener('click', () => {
    if (!toggleSimulation.checked) {
      alert('Simulation is turned off. Please turn on the simulation to save data.');
      return; // Hentikan proses jika toggle slider dimatikan
    }

    const simulationName = simulationNameInput.value.trim();
  
    if (simulationName) {
      const data = {
        simulationName: simulationName,
        kelembabanTanah: currentKelembabanTanah, // Gunakan nilai yang sudah disimpan
        derajatKemiringan: currentKemiringan, // Gunakan nilai yang sudah disimpan
        curahHujan: currentCurahHujan, // Gunakan nilai yang sudah disimpan
      };
  
      // Kirim data ke backend PHP
      fetch('php/save_simulation.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success") {
            alert(`Simulation "${simulationName}" saved successfully!`);
            simulationText.textContent = simulationName;
  
            // Hanya menutup popup jika penyimpanan berhasil
            simulationPopup.style.display = 'none';
            simulationOverlay.style.display = 'none';
          } else {
            alert("Error saving simulation: " + result.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while saving the simulation.");
        });
    } else {
      alert('Please enter a simulation name.');
      toggleSimulation.checked = false;
    }
  });

  // Event listener untuk tombol "Cancel"
  closeButton.addEventListener('click', () => {
    simulationPopup.style.display = 'none'; // Tutup popup
    simulationOverlay.style.display = 'none'; // Sembunyikan overlay
    toggleSimulation.checked = false; // Reset slider ke OFF
  });

  // Tutup popup jika overlay di-klik
  simulationOverlay.addEventListener('click', () => {
    simulationPopup.style.display = 'none'; // Tutup popup
    simulationOverlay.style.display = 'none'; // Sembunyikan overlay
    toggleSimulation.checked = false; // Reset slider ke OFF
  });

  // Menampilkan popup ketika tombol Open Camera diklik
  document.getElementById('open-camera-popup-btn').addEventListener('click', function () {
    document.querySelector('.camera-popup-overlay').style.display = 'block';
    document.querySelector('.camera-popup').style.display = 'block';
  });

  // Menutup popup ketika tombol Close diklik
  document.getElementById('close-camera-popup-btn').addEventListener('click', function () {
    document.querySelector('.camera-popup-overlay').style.display = 'none';
    document.querySelector('.camera-popup').style.display = 'none';
  });
});

// Disable zooming with scroll
document.addEventListener('wheel', function (event) {
  if (event.ctrlKey) {
    event.preventDefault();
  }
}, { passive: false });

// Fungsi untuk navigasi
function navigateTo(page) {
  switch (page) {
    case 'home':
      window.location.href = 'index.html'; // Ganti dengan URL tujuan
      break;
    case 'logout':
      fetch('./php/logout.php', {  // Pastikan path sesuai dengan struktur proyek
          method: 'POST',
          credentials: 'include'  // Agar session cookie dikirim ke server
      })
      .then(response => response.json())
      .then(data => {
          console.log("Logout Response:", data); // Debugging
          if (data.status === "success") {
              alert('You have logged out.');
              sessionStorage.clear(); // Hapus sessionStorage
              localStorage.clear();  // Hapus localStorage jika ada
              window.location.href = 'login.html'; // Redirect ke halaman login
          } else {
              alert('Logout failed. Please try again.');
          }
      })
      .catch(error => console.error("Logout Error:", error));
      break;
    default:
      console.error('Unknown section: ' + page);
  }
}


function handleKemiringan() {
  const kemiringanInput = document.querySelector("#kemiringan-input");
  const simulationNameInput = document.querySelector("#simulation-name");
  const simulationName = simulationNameInput.value.trim();

  if (!simulationName) {
      alert("Silakan isi nama simulasi terlebih dahulu.");
      return;
  }

  const selectedValue = kemiringanInput.value;
  if (!selectedValue) {
      alert("Silakan pilih derajat kemiringan.");
      return;
  }

  const data = {
      simulationName: simulationName,
      kelembabanTanah: currentKelembabanTanah, // Nilai dari sensor
      derajatKemiringan: parseFloat(selectedValue),
      curahHujan: currentCurahHujan // Nilai dari sensor
  };

  // (Opsional) Kirim ke database MySQL
  fetch("php/save_simulation.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
      if (result.status === "success") {
          console.log("Data berhasil disimpan ke database.");
      } else {
          console.error("Gagal menyimpan data:", result.message);
      }
  });

  // Kirim ke MQTT (ESP32 via ThingSpeak)
  fetch("php/send_to_mqtt.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ derajatKemiringan: parseFloat(selectedValue) })
  })
  .then(response => response.json())
  .then(result => {
      if (result.status === "success") {
          alert("Dongkrak bergerak ke " + selectedValue + "°");
      } else {
          alert("Gagal mengirim ke MQTT.");
      }
  })
  .catch(error => {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengirim data.");
  });
}

function handleCurahHujan() {
  if (!toggleSimulation.checked) {
    alert('Simulation is turned off. Please turn on the simulation to input data.');
    return; // Hentikan proses jika toggle slider dimatikan
  }

  const curahHujanInput = document.querySelector('#curah-hujan-input');
  const simulationNameInput = document.querySelector('#simulation-name');
  const simulationName = simulationNameInput.value.trim();

  if (curahHujanInput && simulationName) {
    const curahHujanValue = curahHujanInput.value;
    if (curahHujanValue) {
      // Kirim data ke backend
      sendDataToBackend(
        {
          simulationName: simulationName,
          kelembabanTanah: currentKelembabanTanah, // Gunakan nilai yang sudah disimpan
          derajatKemiringan: currentKemiringan, // Gunakan nilai yang sudah disimpan
          curahHujan: parseFloat(curahHujanValue),
        },
        'curahHujan' // Tentukan jenis data
      );
    } else {
      alert('Silakan masukkan curah hujan.');
    }
  } else {
    alert('Silakan isi nama simulasi terlebih dahulu.');
  }
}

function sendDataToBackend(data, type) {
  fetch('php/save_simulation.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success") {
        // Tampilkan pesan sesuai jenis data
        if (type === 'kemiringan') {
          alert('Nilai kemiringan berhasil diinput.');
        } else if (type === 'curahHujan') {
          alert('Nilai curah hujan berhasil diinput.');
        } else {
          alert(`Data berhasil disimpan: ${JSON.stringify(data)}`);
        }
      } else {
        alert("Error: " + result.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    });
}

document.addEventListener("DOMContentLoaded", function () {
      fetch("./php/check_session.php")
      .then(response => response.text()) // Ambil teks mentah sebelum parsing JSON
      .then(text => {
          console.log("Raw response:", text); // Lihat output asli
          return JSON.parse(text); // Coba parse JSON
      })
      .then(data => {
          console.log("Check Session Response:", data);
          if (data.status !== "success") {
              console.error("Session tidak valid, kembali ke login.");
              window.location.href = "./login.html";
          } else {
              console.log("Session valid:", data);
              let userNameElement = document.getElementById("user-name");
              if (userNameElement) {
                  userNameElement.innerText = data.session_data.name;
              } else {
                  console.warn("Elemen #user-name tidak ditemukan!");
              }
          }
      })
      .catch(error => {
          console.error("Gagal memeriksa session:", error);
          window.location.href = "./login.html";
      });

  // Set nama user di title
  fetch("./php/get_name.php")
      .then(response => response.json())
      .then(data => {
          let userNameElement = document.getElementById("user-name");
          if (data.name) {
              document.title = `Home Page - ${data.name}`;
              if (userNameElement) {
                  userNameElement.innerText = data.name;
              }
          } else {
              document.title = "Home Page - Guest";
              if (userNameElement) {
                  userNameElement.innerText = "Guest";
              }
          }
      })
      .catch(() => {
          document.title = "Home Page - Guest";
          let userNameElement = document.getElementById("user-name");
          if (userNameElement) {
              userNameElement.innerText = "Guest";
          }
      });
});

function updateKemiringan() {
  fetch('php/get_kemiringan.php')
    .then(response => response.text())
    .then(data => {
      document.getElementById('nilaiKemiringan').textContent = data;
    })
    .catch(error => {
      console.error('Gagal mengambil data:', error);
    });
}

setInterval(updateKemiringan, 1000); // Update setiap 1 detik
updateKemiringan(); // Panggil pertama kali langsung