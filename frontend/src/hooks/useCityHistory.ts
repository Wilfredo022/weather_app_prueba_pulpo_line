interface VisitedCity {
  id: string;
  city: string;
  lat: number;
  lon: number;
  timestamp: number;
}

export const useCityHistory = () => {
  const addCityToHistory = (
    cityData: Omit<VisitedCity, "id" | "timestamp">
  ) => {
    const history = getCityHistory();
    const newCity: VisitedCity = {
      ...cityData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    const filteredHistory = history.filter(
      (item) => item.city !== cityData.city
    );

    const updatedHistory = [newCity, ...filteredHistory].slice(0, 100);
    localStorage.setItem("cityHistory", JSON.stringify(updatedHistory));
  };

  const getCityHistory = (): VisitedCity[] => {
    const history = localStorage.getItem("cityHistory");
    return history ? JSON.parse(history) : [];
  };

  return { addCityToHistory, getCityHistory };
};
