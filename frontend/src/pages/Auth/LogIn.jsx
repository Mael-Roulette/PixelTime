import { useTranslation } from "react-i18next";
import { NavLink, useNavigate, useLocation } from "react-router";
import { useState } from "react";
import authService from "../../../services/authService";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LogIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const successMessage = location.state?.message;

  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateLoginForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = t('login.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('login.errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('login.errors.passwordRequired');
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authService.login(formData.email, formData.password);

      navigate("/gamechoice");
    } catch (error) {
      setErrors({
        general: error.message || t('login.errors.loginFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className='header-login'>
        <NavLink to={"/"}>{t("global.backHome")}</NavLink>
      </header>
      <main className='main-login'>
        <div className='main-login-form'>
          <h1>{t("login.title")}</h1>

          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='email'>
                Email
                <input
                  type='email'
                  name='email'
                  id='email'
                  placeholder='email@email.com'
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  autoComplete="email"
                  required
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </label>

              <label htmlFor='password'>
                {t("login.password")}
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name='password'
                    id='password'
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete='current-password'
                    className={`password-input ${errors.password ? 'error' : ''}`}
                    required
                  />
                  <span
                    className='password-toggle'
                    onClick={handleToggle}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#293858",
                    }}
                  >
                    {showPassword ? (
                      <FiEye size={20} />
                    ) : (
                      <FiEyeOff size={20} />
                    )}
                  </span>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </label>
            </div>

            <button
              type='submit'
              className='submit-button button-primary'
              disabled={isLoading}
            >
              {isLoading ? t('global.loading') : t("login.continue")}
            </button>
          </form>

          <p>
            {t("login.noAccount")}
            <NavLink to='/signin'> {t("login.signup")}</NavLink>
          </p>

          <p>
            <NavLink to='/forgotpassword'> {t("login.forgotPassword")}</NavLink>
          </p>
        </div>
      </main>
    </>
  );
}