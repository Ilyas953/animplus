
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === target) {
          panel.classList.add('active');
        }
      });
    });
  });



  const button = document.getElementById("toggleOrder");
  const icon = button.querySelector("i");
  const grid = document.querySelector(".grid-cards");

  let isReversed = false;

  button.addEventListener("click", () => {
    const cards = Array.from(grid.children);
    grid.innerHTML = "";
    cards.reverse().forEach(card => grid.appendChild(card));
    isReversed = !isReversed;


    icon.className = isReversed ? "fas fa-sort-amount-up-alt" : "fas fa-sort-amount-down-alt";
  });