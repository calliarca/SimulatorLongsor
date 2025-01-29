function navigateTo(page) {
  switch (page) {
    case 'home':
      window.location.href = 'index.html'; // Ganti dengan URL tujuan
      break;
    case 'rainfall':
      window.location.href = '404.html'; // Ganti dengan URL tujuan
      break;
    case 'cameras':
      window.location.href = '404.html'; // Ganti dengan URL tujuan
      break;
    case 'humidity':
      window.location.href = '404.html'; // Ganti dengan URL tujuan
      break;
    case 'logout':
      alert('You have logged out.');
      window.location.href = 'login.html'; // Ganti dengan URL tujuan
      break;
    default:
      console.error('Unknown section: ' + page);
  }
}

// Pastikan elemen-elemen yang diperlukan ada di dalam DOM sebelum menambahkan event listeners
document.addEventListener('DOMContentLoaded', () => {
  const toggleSimulation = document.querySelector('#toggle-simulation');
  const simulationPopup = document.querySelector('#simulation-popup');
  const simulationOverlay = document.querySelector('#popup-overlay');
  const saveButton = document.querySelector('#save-simulation-btn');
  const closeButton = document.querySelector('#close-popup-btn');
  const simulationNameInput = document.querySelector('#simulation-name');
  const simulationText = document.querySelector('#simulation-text'); // Elemen teks untuk menampilkan nama simulasi

  // Event listener untuk checkbox (slider)
  toggleSimulation.addEventListener('change', (event) => {
    if (event.target.checked) {
      simulationPopup.style.display = 'block'; // Tampilkan popup
      simulationOverlay.style.display = 'block'; // Tampilkan overlay
    } else {
      simulationPopup.style.display = 'none'; // Sembunyikan popup
      simulationOverlay.style.display = 'none'; // Sembunyikan overlay
      simulationText.textContent = 'START SIMULATION'; // Reset teks
    }
  });

  // Event listener untuk tombol "Save"
  saveButton.addEventListener('click', () => {
    const simulationName = simulationNameInput.value.trim();
    
    if (simulationName) {
      simulationText.textContent = simulationName; // Ubah teks menjadi nama simulasi
      alert(`Simulation "${simulationName}" started!`);
      simulationPopup.style.display = 'none'; // Tutup popup
      simulationOverlay.style.display = 'none'; // Sembunyikan overlay
    } else {
      alert('Please enter a simulation name.'); // Validasi input
      toggleSimulation.checked = false; // Reset slider ke OFF
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
  document.getElementById('open-camera-popup-btn').addEventListener('click', function() {
    document.querySelector('.camera-popup-overlay').style.display = 'block';
    document.querySelector('.camera-popup').style.display = 'block';
  });

  // Menutup popup ketika tombol Close diklik
  document.getElementById('close-camera-popup-btn').addEventListener('click', function() {
    document.querySelector('.camera-popup-overlay').style.display = 'none';
    document.querySelector('.camera-popup').style.display = 'none';
  });
});

// Disable zooming with scroll
document.addEventListener('wheel', function(event) {
  if (event.ctrlKey) {
    event.preventDefault();
  }
}, { passive: false });