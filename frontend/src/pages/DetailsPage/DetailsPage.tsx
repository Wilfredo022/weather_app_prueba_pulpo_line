import { useNavigate } from "react-router-dom";
import { useWeatherStore } from "../../stores/useDetailsStore";
import { ArrowLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import "./DetailsPage.css";
import { useEffect } from "react";
import { useCityHistory } from "../../hooks/useCityHistory";
import { deleteFavorite } from "../../services/favorites/deleteFavorite";
import { createFavorite } from "../../services/favorites/createFavorite";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const DetailsPage = () => {
  const navigate = useNavigate();
  const { addCityToHistory } = useCityHistory();
  const { weatherData, clearWeatherData } = useWeatherStore();
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const { t, i18n } = useTranslation();
  const userId = 1;

  useEffect(() => {
    if (!weatherData) {
      navigate("/");
      return;
    }

    addCityToHistory({
      city: weatherData.location.name + " " + weatherData.location.country,
      lat: weatherData.location.lat,
      lon: weatherData.location.lon,
    });
  }, [weatherData, navigate, addCityToHistory]);

  if (!weatherData) {
    return <div>{t("details.noData")}</div>;
  }

  const handleBack = () => {
    clearWeatherData();
    navigate(-1);
  };

  const isFavorite = favorites.some(
    (fav) =>
      fav.lat === weatherData?.location.lat &&
      fav.lon == weatherData?.location.lon
  );

  const handleFavorite = async () => {
    if (!weatherData) return;

    try {
      if (isFavorite) {
        // Eliminar
        const favorite = favorites.find(
          (f) => f.city === weatherData.location.name
        );
        if (favorite) {
          await deleteFavorite(favorite.id);
          removeFavorite(favorite.id);
          toast(t("details.removeFavorite", { city: favorite.city }));
        }
      } else {
        const response = await createFavorite({
          userId: userId,
          city: weatherData.location.name + " " + weatherData.location.country,
          lat: weatherData.location.lat,
          lon: weatherData.location.lon,
        });
        addFavorite(response);
        toast(t("details.addFavorite", { city: weatherData.location.name }));
      }
    } catch (error) {
      console.error(t("details.error"), error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="details">
      <div className="header-details">
        <button
          className="header-btn-back"
          onClick={() => handleBack()}
          aria-label={t("details.back")}
        >
          <ArrowLeftIcon className="icon" />
        </button>

        <div className="header-details-nameCity">
          <h2>{weatherData.location.name}</h2>
          <p>
            {weatherData.location.country},{" "}
            {formatDate(weatherData.location.localtime)}
          </p>
        </div>

        <div className="header-btn-fav">
          <button
            onClick={handleFavorite}
            aria-label={
              isFavorite
                ? t("details.removeFavorite", {
                    city: weatherData.location.name,
                  })
                : t("details.addFavorite", { city: weatherData.location.name })
            }
          >
            {isFavorite ? (
              <HeartSolid className="isFav" />
            ) : (
              <HeartIcon className="icon" />
            )}
          </button>
        </div>
      </div>

      <div className="body-condition-details">
        <img
          src={weatherData.current.condition.icon}
          alt={weatherData.current.condition.text}
        />
        <p>{weatherData.current.condition.text}</p>
      </div>

      <div className="data-additional-details">
        <div>
          <p className="data-title">{t("details.temperature")}</p>
          <div className="box-data-temperature-details">
            <p className="data-text">
              {weatherData.current.temp_c} {t("details.units.celsius")}
            </p>
            <p className="data-text">
              {weatherData.current.temp_f} {t("details.units.fahrenheit")}
            </p>
          </div>
        </div>

        <div>
          <p className="data-title">{t("details.humidity")}</p>
          <p className="data-text">{weatherData.current.humidity}%</p>
        </div>

        <div>
          <p className="data-title">{t("details.wind")}</p>
          <p className="data-text">
            {weatherData.current.wind_kph} {t("details.units.kph")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
