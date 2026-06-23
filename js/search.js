const SEARCH_CATEGORIES = [
  { name: 'Cuisines sur mesure', url: 'cuisine.html', keywords: ['cuisine', 'cuisines'] },
  { name: 'Dressings sur mesure', url: 'dressing.html', keywords: ['dressing', 'dressings'] },
  { name: 'Chambres à coucher', url: 'chambre.html', keywords: ['chambre', 'chambres', 'coucher'] },
  { name: 'Salle à manger', url: 'salle-a-manger.html', keywords: ['salle a manger', 'salle', 'manger'] },
  { name: 'Salon sur mesure', url: 'salon.html', keywords: ['salon', 'salons'] },
  { name: 'Meubles TV sur mesure', url: 'meuble-tv.html', keywords: ['meuble tv', 'meubles tv', 'tv', 'television', 'tele'] }
];

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

function normalizeSearch(str) {
  return str
    .toLowerCase()
    .replace(/[àâ]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/ç/g, 'c')
    .trim();
}

function findCategoryMatches(query) {
  const q = normalizeSearch(query);
  if (!q) return [];
  return SEARCH_CATEGORIES.filter(cat =>
    normalizeSearch(cat.name).includes(q) || cat.keywords.some(k => normalizeSearch(k).includes(q))
  );
}

function renderSearchResults(matches) {
  const hasQuery = searchInput.value.trim().length > 0;
  if (!hasQuery) {
    searchResults.classList.remove('is-open');
    searchResults.innerHTML = '';
    return;
  }
  searchResults.innerHTML = matches.length > 0
    ? matches.map(cat => `<a href="${cat.url}" class="search-result-item">${cat.name}</a>`).join('')
    : '<p class="search-empty">Aucune catégorie trouvée</p>';
  searchResults.classList.add('is-open');
}

searchInput.addEventListener('input', () => {
  renderSearchResults(findCategoryMatches(searchInput.value));
});

searchInput.addEventListener('focus', () => {
  if (searchInput.value.trim()) renderSearchResults(findCategoryMatches(searchInput.value));
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.header-search')) {
    searchResults.classList.remove('is-open');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') searchResults.classList.remove('is-open');
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const matches = findCategoryMatches(searchInput.value);
  if (matches.length > 0) {
    window.location.href = matches[0].url;
  }
});
