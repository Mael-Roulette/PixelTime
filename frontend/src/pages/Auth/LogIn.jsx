import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { useState } from "react";

import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LogIn() {
  const { t } = useTranslation();

  const [password, setPassword] = useState("");
  const [type, setType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword(!showPassword);
    setType(showPassword ? 'password' : 'text');
  }

  return (
    <>
      <header className="header-login">
        <NavLink to={"/"}>{t("global.backHome")}</NavLink>
      </header>

      <main className="main-login">
        <div className="main-login-form">
          <h1>{t("login.title")}</h1>
          <form>
            <div className="form-group">
              <label htmlFor="email">
                Email
                <input type="email" name="email" />
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
            <input type="submit" value={t("login.continue")} className="button-primary" />
          </form>
          <p>
            {t("login.noAccount")}
            <a href="/inscription"> {t("login.signup")}</a>
          </p>
        </div >
      </main >
    </>
  )
}