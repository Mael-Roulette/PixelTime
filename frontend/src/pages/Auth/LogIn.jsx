import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";

import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LogIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [type, setType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword(!showPassword);
    setType(showPassword ? 'password' : 'text');
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Formulaire valide");
    navigate('/gamechoice');
  };

  return (
    <>
      <header className="header-login">
        <NavLink to={"/"}>{t("global.backHome")}</NavLink>
      </header>

      <main className="main-login">
        <div className="main-login-form">
          <h1>{t("login.title")}</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                Email
                <input type="email" name="email" placeholder="email@email.com" required />
              </label>
              <label htmlFor="password">
                {t("login.password")}
                <div style={{ position: 'relative' }}>
                  <input
                    type={type}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="password-input"
                    minLength="8"
                    pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$"
                    title="Le mot de passe doit contenir au moins 8 caractères avec une majuscule, un chiffre et un caractère spécial (!@#$%^&*)."
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={handleToggle}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: "#293858"
                    }}
                  >
                    {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                  </span>
                </div>
              </label>
            </div>
            <button type="submit" className="submit-button button-primary">
              {t("login.continue")}
            </button>
          </form>
          <p>
            {t("login.noAccount")}
            <a href="/signin"> {t("login.signup")}</a>
          </p>
          <p>
            <a href="/forgotpassword"> {t("login.forgotPassword")}</a>
          </p>
        </div>
      </main>
    </>
  )
}