import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  userId: number | null;
  initialized: boolean;
  setUserId: (id: number) => void;
  setInitializer: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;

  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!localStorage.getItem("token"),
  userId: null,
  initialized: false,
  login: (token: string) => {
    localStorage.setItem("token", token);
    set({ isAuthenticated: true });
  },
  setUserId: (id: number) => set({ userId: id }),
  setInitializer: (value: boolean) => set({ initialized: value }),
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false });
  },
}));
