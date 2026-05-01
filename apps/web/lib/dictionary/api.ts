import type { WordEntry } from './mock-data';

export async function searchWord(query: string): Promise<WordEntry | null> {
  if (!query.trim()) return null;
  try {
    const res = await fetch(`/api/dictionary?q=${encodeURIComponent(query.trim())}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
