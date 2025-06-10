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





