  const filterButtons = document.querySelectorAll('.filter-btn');
  const animeCards = document.querySelectorAll('.anime-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Retirer la classe active de tous les boutons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      animeCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'flex';  // ou block selon le display de .anime-card
        } else {
          card.style.display = card.getAttribute('data-lang') === filter ? 'flex' : 'none';
        }
      });
    });
  });





// Tableau des jours en français, en accord avec tes id/data-day
const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

// On récupère le jour actuel
const aujourdHui = new Date();
const jourActuel = jours[aujourdHui.getDay()];  // ex: "Mardi"

// On sélectionne la div correspondant au jour actuel et on ajoute la classe "today"
const dayCard = document.querySelector(`.day-card[data-day="${jourActuel}"]`);
if(dayCard) {
  dayCard.classList.add("today");
}
