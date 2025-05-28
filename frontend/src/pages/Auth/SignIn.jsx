import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { useState } from "react";

import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignIn() {
  const { t } = useTranslation();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  
  // États séparés pour chaque champ
  const [typePassword, setTypePassword] = useState('password');
  const [typePasswordConfirm, setTypePasswordConfirm] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Fonction pour le premier champ mot de passe
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    setTypePassword(showPassword ? 'password' : 'text');
  }
  
  // Fonction pour le champ confirmer mot de passe
  const handleTogglePasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
    setTypePasswordConfirm(showPasswordConfirm ? 'password' : 'text');
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
              <div className="form-group-info">
                <label htmlFor="pseudo">
                  Pseudo*
                  <input type="text" name="pseudo" />
                </label>
                <label htmlFor="email">
                  Email*
                  <input type="email" name="email" placeholder="email@email.com" />
                </label>
              </div>
              <div className="form-group-password">
                <label htmlFor="password">
                  {t("signup.password")}*
                  <div style={{ position: 'relative' }}>
                    <input
                      type={typePassword}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <span
                      className="password-toggle"
                      onClick={handleTogglePassword}
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
                      type={typePasswordConfirm}
                      name="confirm-password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      autoComplete="new-password"
                    />
                    <span
                      className="password-toggle"
                      onClick={handleTogglePasswordConfirm}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: "#293858"
                      }}
                    >
                      {showPasswordConfirm ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                    </span>
                  </div>
                </label>
              </div>
              <p className="form-group-required">*{t("signup.fieldsRequired")}</p>
            </div>
            <input type="submit" value={t("signup.continue")} className="submit-button button-primary" />
          </form>
          <p>
            {t("signup.alreadyHaveAccount")}
            <a href="/login"> {t("signup.login")}</a>
          </p>
        </div>
      </main>
    </>
  )
}