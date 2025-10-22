export async function searchBooks(query, limit = 20) {
    const url = new URL('https://openlibrary.org/search.json');
    url.searchParams.set('q', query);
    url.searchParams.set('limit', String(limit));

    const res = await fetch(url.href);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const docs = Array.isArray(data.docs) ? data.docs : [];
    return docs;
}