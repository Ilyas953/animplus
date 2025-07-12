const searchInput = document.getElementById('searchInput');
const gridItems = document.querySelectorAll('.grid-item');
let timeout = null;

function filterGrid() {
  const filter = searchInput.value.toLowerCase().trim();
  let matchedItems = [];

  gridItems.forEach(item => {
    const title = item.getAttribute('data-title');
    if (!title) {
      item.style.display = 'none';
      return;
    }
    const titleLower = title.toLowerCase();

    if (filter === '') {

      item.style.display = '';
      matchedItems.push(item);
    } else if (titleLower.includes(filter)) {
      item.style.display = '';
      matchedItems.push(item);
    } else {
      item.style.display = 'none';
    }
  });

  // Afficher les résultats
  displayResults(matchedItems);
  
  // Mettre à jour le compteur
  updateResultCount(matchedItems.length);

  return matchedItems;
}

searchInput.addEventListener('input', () => {
  clearTimeout(timeout);

  if (searchInput.value.trim() === '') {

    gridItems.forEach(item => item.style.display = '');
    return; 
  }

  const matchedItems = filterGrid();

  if (matchedItems.length === 1) {
    const exactTitle = matchedItems[0].getAttribute('data-title').toLowerCase();
    const searchValue = searchInput.value.toLowerCase().trim();

    if (exactTitle === searchValue) {
      timeout = setTimeout(() => {
        const link = matchedItems[0].querySelector('a');
        if (link) {
          window.location.href = link.href;
        }
      }, 1000);
    }
  }
});


searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const matchedItems = filterGrid();

    if (matchedItems.length > 0) {
      const link = matchedItems[0].querySelector('a');
      if (link) {
        window.location.href = link.href;
      }
    }
  }
});















const filters = {
  genre: '',
  language: '',
  category: '',
  year: '',
  theme: ''
};

const filterElements = {
  genre: document.getElementById('filter-genre'),
  language: document.getElementById('filter-language'),
  category: document.getElementById('filter-category'),
  year: document.getElementById('filter-year'),
  theme: document.getElementById('filter-theme')
};


function applyFilters() {
  gridItems.forEach(item => {
    const itemGenre = item.dataset.genre?.toLowerCase() || '';
    const itemLang = item.dataset.language?.toLowerCase() || '';
    const itemCat = item.dataset.category?.toLowerCase() || '';
    const itemYear = item.dataset.year || '';
    const itemThemes = item.dataset.theme?.toLowerCase().split(',') || [];

    const matchGenre = !filters.genre || itemGenre === filters.genre;
    const matchLang = !filters.language || itemLang === filters.language;
    const matchCat = !filters.category || itemCat === filters.category;
    const matchYear = !filters.year || itemYear === filters.year;
    const matchTheme = !filters.theme || itemThemes.includes(filters.theme);

    if (matchGenre && matchLang && matchCat && matchYear && matchTheme) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Lier les filtres à la logique
Object.keys(filterElements).forEach(key => {
  filterElements[key].addEventListener('change', (e) => {
    filters[key] = e.target.value.toLowerCase();
    applyFilters();
  });
});

// Réinitialisation
document.getElementById('reset-filters').addEventListener('click', () => {
  Object.keys(filters).forEach(key => {
    filters[key] = '';
    filterElements[key].value = '';
  });
  applyFilters();
});

















document.addEventListener("DOMContentLoaded", () => {
  const ITEMS_PER_PAGE = 21;
  let currentPage = 1;

  const container = document.querySelector(".grid-container");
  const items = Array.from(container.querySelectorAll(".grid-item"));
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);


  const pagination = document.createElement("div");
  pagination.className = "pagination-container";
  container.parentNode.insertBefore(pagination, container.nextSibling);


  function showPage(page) {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentPage = page;


    items.forEach((item, i) => {
      item.style.display =
        i >= (page - 1) * ITEMS_PER_PAGE && i < page * ITEMS_PER_PAGE
          ? "block"
          : "none";
    });

    renderPagination();
  }


  function renderPagination() {
    pagination.innerHTML = "";


    const prevBtn = document.createElement("button");
    prevBtn.className = "pagination-btn";
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => showPage(currentPage - 1));
    pagination.appendChild(prevBtn);


    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = "pagination-btn";
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => showPage(i));
      pagination.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.className = "pagination-btn";
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => showPage(currentPage + 1));
    pagination.appendChild(nextBtn);
  }

  showPage(currentPage);
});
