// src/stores/useWeatherStore.ts
import { create } from "zustand";
import type { WeatherData } from "../interface/WeatherData";

interface WeatherStore {
  weatherData: WeatherData | null;
  setWeatherData: (data: WeatherData) => void;
  clearWeatherData: () => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  weatherData: null,
  setWeatherData: (data) => set({ weatherData: data }),
  clearWeatherData: () => set({ weatherData: null }),
}));
