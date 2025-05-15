import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { HeartIcon, LinkIcon, TrashIcon } from "@heroicons/react/24/outline";
import "./FavoritesPage.css";
import type { Favorite } from "../../interface/favorites";
import { useWeatherStore } from "../../stores/useDetailsStore";
import { HeaderTitle } from "../../components";
import { searchCoordinates } from "../../services/search/searchCoordinates";
import { deleteFavorite } from "../../services/favorites/deleteFavorite";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavoritesStore();
  const { setWeatherData } = useWeatherStore();
  const { t, i18n } = useTranslation();

  const deleteFav = async (id: string, city: string) => {
    await deleteFavorite(id);
    removeFavorite(id);
    toast(t("favorites.deleteNotification", { city }));
  };

  const goDetails = async (data: Favorite) => {
    const response = await searchCoordinates({
      city: data.city,
      lat: data.lat!,
      lon: data.lon!,
      lang: i18n.language,
    });

    setWeatherData(response.data);
    navigate("/details");
  };

  return (
    <div>
      <HeaderTitle title={t("favorites.title")} />

      <div className="container-list-favorites">
        {Array.isArray(favorites) &&
          favorites.length > 0 &&
          favorites.map((favorite) => (
            <div className="card-favorites" key={favorite.id}>
              <p>{favorite.city}</p>

              <div className="box-options-favorites">
                <button
                  onClick={() => goDetails(favorite)}
                  aria-label={t("favorites.viewDetails")}
                >
                  <LinkIcon className="icon" />
                </button>
                <button
                  className="delete"
                  onClick={() => deleteFav(favorite.id, favorite.city)}
                  aria-label={t("favorites.delete")}
                >
                  <TrashIcon className="icon" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {Array.isArray(favorites) && favorites.length == 0 && (
        <div className="not-data">
          <h3>{t("favorites.noFavorites")}</h3>
          <HeartIcon className="icon-not-data" />
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
