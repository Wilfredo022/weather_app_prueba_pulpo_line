import {
  ArrowRightStartOnRectangleIcon,
  HeartIcon,
  EllipsisHorizontalIcon,
  GlobeAltIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Search } from "../../components";
import "./HomePage.css";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { clearFavorite } = useFavoritesStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const goRoute = (route: string) => {
    navigate(route);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguageMenu = () => {
    setLanguageOpen(!languageOpen);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      setLanguageOpen(false);
      setCurrentLanguage(lng);
    });
  };

  const closeSession = () => {
    logout();
    clearFavorite();
  };

  return (
    <div className="container-homePage">
      <div className="header-homePage">
        <h2>{t("weatherApp")}</h2>
        <div className="header-actions">
          <div className="language-selector">
            <button className="language-toggle" onClick={toggleLanguageMenu}>
              <GlobeAltIcon className="icon icon-button-options" />
              <span>{currentLanguage === "en" ? "EN" : "ES"}</span>
            </button>

            {languageOpen && (
              <div className="language-menu">
                <button
                  onClick={() => changeLanguage("es")}
                  className={currentLanguage === "es" ? "active" : ""}
                >
                  <span>Español</span>
                  {currentLanguage === "es" && (
                    <CheckIcon className="icon check-icon" />
                  )}
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className={currentLanguage === "en" ? "active" : ""}
                >
                  <span>English</span>
                  {currentLanguage === "en" && (
                    <CheckIcon className="icon check-icon" />
                  )}
                </button>
              </div>
            )}
          </div>

          <button className="menu-toggle" onClick={toggleMenu}>
            <EllipsisHorizontalIcon className="icon icon-button-options" />
          </button>

          <div className={`menu-container ${isMenuOpen ? "open" : ""}`}>
            <button onClick={() => goRoute("/favorites")}>
              <HeartIcon className="icon" />
              <span>{t("favorites.title")}</span>
            </button>
            <button onClick={() => goRoute("/history")}>
              <GlobeAltIcon className="icon" />
              <span>{t("history.title")}</span>
            </button>
            <button onClick={() => closeSession()}>
              <ArrowRightStartOnRectangleIcon className="icon" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <Search />
      </div>
    </div>
  );
};

export default HomePage;
