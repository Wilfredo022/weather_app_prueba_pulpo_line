import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useWeatherStore } from "../../stores/useDetailsStore";
import { searchCoordinates } from "../../services/search/searchCoordinates";
import apiClient from "../../services/apiClient";
import "./Search.css";
import { useTranslation } from "react-i18next";

interface Suggestion {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

export interface WeatherSearchParams {
  queryType: "name" | "coordinates";
  city?: string;
  lat?: number;
  lon?: number;
}

export const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { setWeatherData } = useWeatherStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (query.trim().length > 2) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const fetchSuggestions = async (searchQuery: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.get(
        `/autocomplete?query=${searchQuery}`
      );

      if (response.data.length == 0) {
        setError(t("search.noResults", { query }));
        return;
      }

      setSuggestions(response.data);
    } catch (err) {
      setError(t("search.suggestionsError"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (
    params: WeatherSearchParams | React.FormEvent<HTMLFormElement>
  ) => {
    let searchParams: WeatherSearchParams;

    if (query.trim().length <= 0) {
      if (typeof params === "object" && "preventDefault" in params) {
        params.preventDefault();
      }
      setError(t("search.emptyField"));
      setIsLoading(false);
      setQuery("");
      return;
    }

    // Determinar el tipo de búsqueda
    if (typeof params === "object" && "preventDefault" in params) {
      params.preventDefault();
      searchParams = {
        queryType: "name",
        city: query.trim(),
      };
    } else {
      searchParams = params as WeatherSearchParams;
    }

    setIsLoading(true);
    setError("");

    try {
      let response;

      if (searchParams.queryType === "coordinates") {
        response = await searchCoordinates({
          city: query,
          lat: searchParams.lat!,
          lon: searchParams.lon!,
          lang: i18n.language,
        });
      } else {
        response = await apiClient.get(`/weather`, {
          params: {
            city: searchParams.city,
            lang: i18n.language,
          },
        });
      }

      setWeatherData(response.data);
      navigate("/details");
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || t("search.weatherError");
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (isNaN(suggestion.lat) || isNaN(suggestion.lon)) {
      setError(t("search.invalidCoordinates"));
      return;
    }

    setQuery(suggestion.name);
    setSuggestions([]);
    handleSearch({
      queryType: "coordinates",
      lat: suggestion.lat,
      lon: suggestion.lon,
    });
  };

  return (
    <div className="container-search">
      <form onSubmit={handleSearch}>
        <div className="search-wrapper">
          <input
            className="input-search"
            placeholder={t("search.placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t("search.placeholder")}
          />
          <div className="button-search">
            <button
              type="submit"
              disabled={isLoading}
              aria-label={t("search.placeholder")}
            >
              {isLoading ? (
                <span className="loading-spinner" aria-hidden="true">
                  {t("search.loading")}
                </span>
              ) : (
                <MagnifyingGlassIcon className="icon" />
              )}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        {suggestions?.length > 0 && Array.isArray(suggestions) && (
          <ul className="suggestions-list">
            {suggestions?.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};
