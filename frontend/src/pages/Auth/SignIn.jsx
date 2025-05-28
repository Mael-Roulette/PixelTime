import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";

import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [typePassword, setTypePassword] = useState('password');
  const [typePasswordConfirm, setTypePasswordConfirm] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    setTypePassword(showPassword ? 'password' : 'text');
  };

  const handleTogglePasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
    setTypePasswordConfirm(showPasswordConfirm ? 'password' : 'text');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (passwordConfirm && value !== passwordConfirm) {
      setPasswordError("Les mots de passe ne correspondent pas");
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordConfirmChange = (e) => {
    const value = e.target.value;
    setPasswordConfirm(value);

    if (password && value !== password) {
      setPasswordError("Les mots de passe ne correspondent pas");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }

    console.log("Formulaire valide");
    navigate('/login');
  };

  return (
    <>
      <header className="header-login">
        <NavLink to={"/"}>{t("global.backHome")}</NavLink>
      </header>

      <main className="main-login">
        <div className="main-login-form">
          <h1>{t("signup.title")}</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="form-group-info">
                <label htmlFor="pseudo">
                  Pseudo*
                  <input type="text" name="pseudo" required />
                </label>
                <label htmlFor="email">
                  Email*
                  <input type="email" name="email" placeholder="email@email.com" required />
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
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      minLength="8"
                      pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$"
                      title="Le mot de passe doit contenir au moins 8 caractères avec une majuscule, un chiffre et un caractère spécial (!@#$%^&*)."
                      required
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
                      onChange={handlePasswordConfirmChange}
                      autoComplete="new-password"
                      minLength="8"
                      required
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
              {passwordError && <p className="error-message" style={{ color: 'red' }}>{passwordError}</p>}
              <p className="form-group-required">*{t("signup.fieldsRequired")}</p>
            </div>
            <button type="submit" className="submit-button button-primary">
              {t("signup.continue")}
            </button>
          </form>
          <p>
            {t("signup.alreadyHaveAccount")}
            <a href="/login"> {t("signup.login")}</a>
          </p>
        </div>
      </main>
    </>
  );
}