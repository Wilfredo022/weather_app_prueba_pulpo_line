import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Tu sesión ha expirado", {
        description: "Por favor inicia sesión nuevamente",
        duration: 5000,
      });
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
