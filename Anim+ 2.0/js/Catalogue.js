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


  console.log('Recherche:', filter, '| Items affichés:', matchedItems.length);
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















document.addEventListener('DOMContentLoaded', () => {
  const filterBtn = document.getElementById('filterBtn');
  const filterPanel = document.getElementById('filterPanel');
  const filterOptions = document.querySelectorAll('.filter-option');
  const searchInput = document.getElementById('searchInput');
  const gridItems = document.querySelectorAll('.grid-item');
  let timeout = null;


  filterBtn.addEventListener('click', () => {
    filterPanel.style.display = filterPanel.style.display === 'none' ? 'block' : 'none';
  });

  function getActiveFilters() {
    const filters = {
      genres: [],
      categories: [],
      languages: [],
      years: []
    };

    filterOptions.forEach(input => {
      if (input.checked) {
        const val = input.value.toLowerCase();
        if (['action', 'romance', 'fantasy', 'comedy', 'shonen', 'shojo', 'seinen'].includes(val)) filters.genres.push(val);
        else if (['anime', 'serie', 'film'].includes(val)) filters.categories.push(val);
        else if (['vf', 'vo'].includes(val)) filters.languages.push(val);
        else if (!isNaN(val)) filters.years.push(val);
      }
    });

    return filters;
  }

  function filterGrid() {
    const searchText = searchInput.value.toLowerCase().trim();
    const filters = getActiveFilters();

    gridItems.forEach(item => {
      const title = (item.dataset.title || '').toLowerCase();
      const genre = (item.dataset.genre || '').toLowerCase();
      const category = (item.dataset.category || '').toLowerCase();
      const language = (item.dataset.language || '').toLowerCase();
      const year = (item.dataset.year || '').toLowerCase();

      const matchesSearch = searchText === '' || title.includes(searchText);

      const matchesGenres = filters.genres.length === 0 || filters.genres.includes(genre);
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(category);
      const matchesLanguage = filters.languages.length === 0 || filters.languages.includes(language);
      const matchesYear = filters.years.length === 0 || filters.years.includes(year);

      if (matchesSearch && matchesGenres && matchesCategory && matchesLanguage && matchesYear) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  filterOptions.forEach(opt => opt.addEventListener('change', filterGrid));
  searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    filterGrid();

    const visibleItems = Array.from(gridItems).filter(i => i.style.display !== 'none');
    if (visibleItems.length === 1) {
      const exactTitle = visibleItems[0].dataset.title.toLowerCase();
      const searchValue = searchInput.value.toLowerCase().trim();
      if (exactTitle === searchValue) {
        timeout = setTimeout(() => {
          const link = visibleItems[0].querySelector('a');
          if (link) window.location.href = link.href;
        }, 1000);
      }
    }
  });


  filterGrid();
});


 document.addEventListener('DOMContentLoaded', function() {
    const yearSelect = document.getElementById('date');
    const currentYear = new Date().getFullYear();


    for (let year = 1990; year <= currentYear; year++) {
      const option = document.createElement('option');
      option.value = year.toString();
      option.textContent = year;
      yearSelect.appendChild(option);
    }
  });

  document.getElementById('date').addEventListener('change', function() {
    const selectedYear = this.value;
    const gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(item => {
      const itemYear = item.dataset.year;

      if (selectedYear === 'all' || itemYear === selectedYear) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });

  document.querySelector('.filter-btn').addEventListener('click', function() {
    document.querySelector('.filter-panel').classList.toggle('open');
  });