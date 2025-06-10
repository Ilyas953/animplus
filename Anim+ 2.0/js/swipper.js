const chrono = document.getElementById('chrono');
const dateSortie = new Date('2025-12-20T00:00:00');

function updateChrono() {
  if (!chrono) return; // Si l'élément n'existe pas, on ne fait rien

  const now = new Date();
  const diff = dateSortie - now;

  if (diff <= 0) {
    chrono.textContent = "Disponible maintenant !";
    return;
  }

  const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
  const heures = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const secondes = Math.floor((diff / 1000) % 60);

  chrono.textContent = `${jours}j ${heures}h ${minutes}m ${secondes}s`;
}

// On ne démarre le chrono que si l'élément existe
if (chrono) {
  setInterval(updateChrono, 1000);
  updateChrono();
}
