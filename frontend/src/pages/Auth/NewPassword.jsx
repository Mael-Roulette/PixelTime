import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { useState } from "react";

import { FiEye, FiEyeOff } from "react-icons/fi";

export default function NewPassword() {
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
          <h1>{t("newPassword.passwordConfirm")}</h1>
          <form>
            <div className="form-group">
              <label htmlFor="password">
                {t("newPassword.title")}
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
              <label htmlFor="password-confirm">
                {t("newPassword.passwordConfirm")}
                <div style={{ position: 'relative' }}>
                  <input
                    type={type}
                    name="password-confirm"
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
            <input type="submit" value={t("login.continue")} className="submit-button button-primary" />
          </form>
          <p>
            {t("login.noAccount")}
            <a href="/inscription"> {t("login.signup")}</a>
          </p>
          <p>
            <a href="/motdepasseoublie"> {t("login.forgotPassword")}</a>
          </p>
        </div>
      </main>
    </>
  )
}