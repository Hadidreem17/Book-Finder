import { searchBooks } from './api.js';
import { setStatus, clearResults, renderBooks, renderFavorites } from './ui.js';
import { setLastQuery, getLastQuery } from './storage.js';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');

document.addEventListener('DOMContentLoaded', async () => {
    renderFavorites();

    const last = getLastQuery();
    if (last) {
        input.value = last;
        setStatus('Restored last search…');
        await runSearch(last);
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value.trim();

    if (!q) {
        setStatus('Please enter a search term', 'error');
        return;
    }

    setLastQuery(q);    
    await runSearch(q);  
});

async function runSearch(q) {
    try {
          
        setStatus('Searching...');
        clearResults();

        const docs = await searchBooks(q);
        if (!docs.length) {
            setStatus('No results found.', 'error');
            return;
        }

        setStatus(`Found ${docs.length} results.`);
        renderBooks(docs);
    
    } catch (err) {
        console.error(err);
    
    }
}

function resetHome({ keepInput = false, keepLast = false } = {}) {
  
  clearResults();
  setStatus('');

  if (!keepInput) input.value = '';

  if (!keepLast) {
    try { localStorage.removeItem('lastQuery'); } catch {}
  }

  const topEl = document.getElementById('top') || document.querySelector('header');
  if (topEl?.scrollIntoView) {
    requestAnimationFrame(() => topEl.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  } else {
    requestAnimationFrame(() =>
      (document.scrollingElement || document.documentElement).scrollTo({ top: 0, behavior: 'smooth' })
    );
  }
}
document.querySelector('header h1')?.addEventListener('click', () => {
  resetHome();
});

