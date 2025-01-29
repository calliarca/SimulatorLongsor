// Disable zooming with scroll
document.addEventListener('wheel', function(event) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }, { passive: false });