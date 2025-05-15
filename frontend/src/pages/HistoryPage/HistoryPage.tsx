import { useNavigate } from "react-router-dom";
import { useCityHistory } from "../../hooks/useCityHistory";
import { useWeatherStore } from "../../stores/useDetailsStore";
import { HeaderTitle } from "../../components";
import { searchCoordinates } from "../../services/search/searchCoordinates";
import type { DataSearch } from "../../interface/dataSearch";
import "./HistoryPage.css";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const HistoryPage = () => {
  const { getCityHistory } = useCityHistory();
  const navigate = useNavigate();
  const { setWeatherData } = useWeatherStore();
  const { t, i18n } = useTranslation();
  const history = getCityHistory();

  const handleCityClick = async (data: DataSearch) => {
    const response = await searchCoordinates({
      city: data.city,
      lat: data.lat!,
      lon: data.lon!,
      lang: i18n.language,
    });

    setWeatherData(response.data);
    navigate("/details");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(i18n.language, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="history-container">
      <HeaderTitle title={t("history.title")} />

      <div className="container-list-history">
        {history.length === 0 ? (
          <div className="not-data">
            <h3>{t("history.noHistory")}</h3>
            <GlobeAltIcon className="icon-not-data" />
          </div>
        ) : (
          <ul className="history-list">
            {history.map((city) => (
              <li
                key={city.id}
                onClick={() => handleCityClick(city)}
                className="history-item"
              >
                <p>{city.city}</p>
                <span>
                  {t("history.lastSearch", {
                    date: formatDate(city.timestamp),
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
