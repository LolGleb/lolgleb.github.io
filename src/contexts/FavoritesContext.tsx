import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (articleId: string) => void;
  removeFromFavorites: (articleId: string) => void;
  isFavorite: (articleId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const STORAGE_KEY = 'ticketToSocks_favorites';
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load favorites from localStorage on mount (hydrate once)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Keep only non-empty strings and dedupe while preserving order
          const cleaned: string[] = [];
          const seen = new Set<string>();
          for (const v of parsed) {
            if (typeof v === 'string' && v.trim() && !seen.has(v)) {
              seen.add(v);
              cleaned.push(v);
            }
          }
          setFavorites(cleaned);
        }
      }
    } catch (e) {
      // ignore parse errors and start with empty
      console.warn('[Favorites] Failed to parse saved favorites, starting fresh');
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save favorites to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      // ignore write errors
    }
  }, [favorites, hydrated]);

  const addToFavorites = (articleId: string) => {
    if (typeof articleId !== 'string' || !articleId.trim()) return;
    setFavorites(prev => {
      if (prev.includes(articleId)) return prev;
      return [...prev, articleId];
    });
  };

  const removeFromFavorites = (articleId: string) => {
    if (typeof articleId !== 'string' || !articleId.trim()) return;
    setFavorites(prev => prev.filter(id => id !== articleId));
  };

  const isFavorite = (articleId: string) => {
    if (typeof articleId !== 'string' || !articleId.trim()) return false;
    return favorites.includes(articleId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}