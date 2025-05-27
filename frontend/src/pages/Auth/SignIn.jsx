import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { useState } from "react";

import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SingIn() {
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
          <h1>{t("signup.title")}</h1>
          <form>
            <div className="form-group">
              <label htmlFor="pseudo">
                Pseudo*
                <input type="text" name="pseudo"/>
              </label>
              <label htmlFor="email">
                Email*
                <input type="email" name="email" placeholder="email@email.com" />
              </label>
              <label htmlFor="password">
                {t("signup.password")}*
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
              <label htmlFor="confirm-password">
                {t("signup.confirmPassword")}*
                <div style={{ position: 'relative' }}>
                  <input
                    type={type}
                    name="confirm-password"
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
              <p>*{t("signup.fieldsRequired")}</p>
            </div>
            <input type="submit" value={t("signup.continue")} className="button-primary" />
          </form>
          <p>
            {t("signup.alreadyHaveAccount")}
            <a href="/inscription"> {t("signup.login")}</a>
          </p>
        </div >
      </main >
    </>
  )
}