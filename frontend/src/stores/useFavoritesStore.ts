import { create } from "zustand";
import type { Favorite } from "../interface/favorites";
import apiClient from "../services/apiClient";

// stores/useFavoritesStore.ts

interface FavoritesStore {
  favorites: Favorite[];
  loaded: boolean;
  loadFavorites: (userId: number) => Promise<void>;
  addFavorite: (favorite: Favorite) => void;
  clearFavorite: () => void;
  removeFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesStore>((set) => ({
  favorites: [],
  loaded: false,

  loadFavorites: async (userId: number) => {
    if (useFavoritesStore.getState().loaded) return;

    try {
      const response = await apiClient.get(`/favorites/${userId}`);
      set({ favorites: response.data, loaded: true });
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  },

  addFavorite: (favorite) =>
    set((state) => ({ favorites: [...state.favorites, favorite] })),

  clearFavorite: () => set(() => ({ favorites: [], loaded: false })),

  removeFavorite: (id) =>
    set((state) => ({ favorites: state.favorites.filter((f) => f.id !== id) })),
}));
