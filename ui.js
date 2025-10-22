import { addToFavorites, removeFromFavorites, getFavorites } from './storage.js';

const statusDiv = document.getElementById('status');
const resultsDiv = document.getElementById('results');
const favWrap = document.getElementById('fav-results');

export function setStatus(message, type = 'info') {
    statusDiv.textContent = message || '';
    statusDiv.style.color = type === 'error' ? 'crimson' : '#0ea5e9';
}

export function clearResults() {
    resultsDiv.innerHTML = '';
}

export function renderBooks(docs) {
    clearResults();
    if (!docs.length) {
        setStatus('No results found.', 'error');
        return;
    }
    docs.forEach((b) => resultsDiv.appendChild(createBookCard(b)));
}

function createBookCard(b) {
    const coverId = b.cover_i;
    const cover = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : 'https://via.placeholder.com/128x193?text=No+Cover';

    const title = b.title || 'No Title';
    const authors = (b.author_name || []).join(', ') || 'Unknown Author';
    const year = b.first_publish_year || '';
    const id = b.key || `${title}-${authors}`;

    const card = document.createElement('article');
    card.className = 'book-card';
    card.innerHTML = `
    <div class="book-card__img">
      <img src="${cover}" alt="Cover: ${title}" loading="lazy">
    </div>
    <div class="book-card__info">
      <h3>${title} ${year ? `(${year})` : ''}</h3>
      <p>${authors}</p>
      <button class="fav-btn"> Add to favorite</button>
    </div>
  `;

    card.querySelector('.fav-btn').addEventListener('click', () => {
        const { added } = addToFavorites({ id, title, authors, year, cover });
        setStatus(added ? 'Added to favorite' : 'Book already in favorites', added ? 'info' : 'error');
        renderFavorites();
    });

    return card;
}

export function renderFavorites() {
    if (!favWrap) return;
    const favs = getFavorites();

    if (!favs.length) {
        favWrap.innerHTML = '<p> No favorites added yet </p>';
        return;
    }

    favWrap.innerHTML = favs.map(f => `
    <article class="book-card">
      <div class="book-card__img">
        <img src="${f.cover}" alt="Cover: ${f.title}" loading="lazy">
      </div>
      <div class="book-card__info">
        <h3>${f.title} ${f.year ? `(${f.year})` : ''}</h3>
        <p>${f.authors}</p>
        <button class="remove-fav" data-id="${f.id}">Remove</button>
      </div>
    </article>
  `).join('');

    favWrap.querySelectorAll('.remove-fav').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromFavorites(btn.dataset.id);
            renderFavorites();
            setStatus('Removed from favorites', 'info');
        });
    });
}
