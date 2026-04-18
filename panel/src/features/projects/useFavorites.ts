import { useState, useCallback } from "react";

const STORAGE_KEY = "panel:favoriteProjects";

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeFavorites(favorites: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  } catch {
    // ignore
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites);

  const toggle = useCallback((name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      writeFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((name: string) => favorites.has(name), [favorites]);

  /** Sort: favorites first (preserving original order within each group) */
  const sortWithFavorites = useCallback(
    <T extends { name: string }>(items: T[]): T[] => {
      const fav = items.filter((i) => favorites.has(i.name));
      const rest = items.filter((i) => !favorites.has(i.name));
      return [...fav, ...rest];
    },
    [favorites]
  );

  return { favorites, toggle, isFavorite, sortWithFavorites };
}
