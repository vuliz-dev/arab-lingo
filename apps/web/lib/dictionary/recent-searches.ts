const KEY = 'arablingo_recent';
const MAX = 8;

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function addRecentSearch(term: string): void {
  if (typeof window === 'undefined') return;
  const prev = getRecentSearches().filter((s) => s !== term);
  localStorage.setItem(KEY, JSON.stringify([term, ...prev].slice(0, MAX)));
}
