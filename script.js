'use strict';

const API_URL = 'https://api.tvmaze.com/shows';
const moviesContainer = document.getElementById('moviesContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const errorText = document.getElementById('error');

let allMovies = [];

// Завантаження фільмів з API
async function fetchMovies() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Помилка при завантаженні даних...');
    const data = await response.json();
    allMovies = data;
    renderMovies(allMovies);
  } catch (error) {
    errorText.textContent = error.message;
  }
}

// Відображення списку фільмів
function renderMovies(movies) {
  errorText.textContent = '';
  moviesContainer.innerHTML = '';

  if (movies.length === 0) {
    moviesContainer.innerHTML = '<p>Нічого не знайдено.</p>';
    return;
  }

  for (const { name, image, rating, genres } of movies) {
    const imgSrc = image?.medium || 'https://via.placeholder.com/210x310?text=No+Image';
    const rate = rating?.average || 'N/A';
    const genresText = genres.join(', ');

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${imgSrc}" alt="${name}" />
      <div class="card-content">
        <h3>${name}</h3>
        <p><strong>Рейтинг:</strong> ${rate}</p>
        <p><strong>Жанри:</strong> ${genresText}</p>
      </div>
    `;
    moviesContainer.appendChild(card);
  }
}

// Фільтрація за назвою
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allMovies.filter(({ name }) =>
    name.toLowerCase().includes(query)
  );
  renderMovies(filtered);
});

// Сортування
sortSelect.addEventListener('change', () => {
  const value = sortSelect.value;
  let sorted = [...allMovies];

  if (value === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (value === 'rating') {
    sorted.sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0));
  }

  renderMovies(sorted);
});

// Початковий запуск
fetchMovies();
