import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../../stores/useAuthStore";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import apiClient from "../../services/apiClient";
import "./LoginPage.css";
import { useTranslation } from "react-i18next";

type LoginTFunction = (
  key:
    | "login.errors.invalidEmail"
    | "login.errors.emailRequired"
    | "login.errors.passwordLength"
) => string;

const createLoginSchema = (t: LoginTFunction) =>
  z.object({
    email: z
      .string()
      .email(t("login.errors.invalidEmail"))
      .min(1, t("login.errors.emailRequired")),
    password: z.string().min(6, t("login.errors.passwordLength")),
  });

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

const LoginPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, setUserId } = useAuthStore();
  const { loadFavorites } = useFavoritesStore();
  const navigate = useNavigate();

  const testCredentials = {
    email: "test@test.com",
    password: "123456",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: testCredentials,
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      const response = await apiClient.post("/auth/login", data);

      login(response.data.access_token);
      setUserId(response.data.userId);
      await loadFavorites(response.data.userId);
      navigate("/");
    } catch (err) {
      setError(t("login.errors.invalidCredentials"));
      console.error("Login error:", err);
    }
  };

  return (
    <div className="container">
      <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
        <h2>{t("login.title")}</h2>

        {/* Email */}
        <div className="form-item-box">
          <label>{t("login.email")}</label>
          <input
            placeholder={t("login.emailPlaceholder")}
            type="email"
            {...register("email")}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        {/* Contraseña */}
        <div className="form-item-box">
          <label>{t("login.password")}</label>
          <div className="password-input-container">
            <input
              placeholder={t("login.passwordPlaceholder")}
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={errors.password ? "input-error" : ""}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? t("login.hidePassword") : t("login.showPassword")
              }
            >
              {showPassword ? (
                <EyeIcon className="icon" />
              ) : (
                <EyeSlashIcon className="icon" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="button-submit">
          {t("login.submit")}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
