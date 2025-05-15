import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";

import { lazy, Suspense, useEffect } from "react";

import type { JSX } from "react";
import { AuthInitializer } from "./components/AuthInitializer/AuthInitializer";
import { Toaster } from "sonner";
import { Loading } from "./components";

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const DetailsPage = lazy(() => import("./pages/DetailsPage/DetailsPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage/FavoritesPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage/HistoryPage"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then().catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthInitializer />

      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/details"
            element={
              <ProtectedRoute>
                <DetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
