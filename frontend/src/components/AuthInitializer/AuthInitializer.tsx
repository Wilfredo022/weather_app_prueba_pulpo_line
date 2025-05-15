import { useEffect } from "react";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { jwtDecode } from "jwt-decode";

export const AuthInitializer = () => {
  const { setInitializer, setUserId, setIsAuthenticated } = useAuthStore();
  const { loadFavorites } = useFavoritesStore();

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setInitializer(true);
        setIsAuthenticated(false);
        setUserId(0);
        return;
      }

      try {
        const decoded = jwtDecode<{ sub: number }>(token);
        setUserId(decoded.sub);
        setIsAuthenticated(true);
        await loadFavorites(decoded.sub);
      } catch (error) {
        console.error("Error de autenticación:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserId(0);
      } finally {
        setInitializer(true);
      }
    };

    initialize();
  }, [loadFavorites, setInitializer, setIsAuthenticated, setUserId]);

  return null;
};
