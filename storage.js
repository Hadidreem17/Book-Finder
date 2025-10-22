const FAVORITES_KEY = 'book_favorites';

export function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch {
        return [];
    }
}

export function saveFavorites(list) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

export function addToFavorites(book) {
    const favs = getFavorites();
    if (favs.some(f => f.id === book.id)) {
        return { added: false };
    }
    favs.unshift(book);
    saveFavorites(favs);
    return { added: true };
}

export function removeFromFavorites(id) {
    const next = getFavorites().filter(f => f.id !== id);
    saveFavorites(next);
}

export function setLastQuery(q) {
    localStorage.setItem('lastQuery', q);
}
export function getLastQuery() {
    return localStorage.getItem('lastQuery') || '';
}
