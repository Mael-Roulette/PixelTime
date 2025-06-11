import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import authService from "../../../services/authService";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignIn() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		pseudo: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const handleTogglePassword = () => {
		setShowPassword(!showPassword);
	};

	const handleTogglePasswordConfirm = () => {
		setShowPasswordConfirm(!showPasswordConfirm);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}

		if (
			name === "confirmPassword" &&
			formData.password &&
			value !== formData.password
		) {
			setErrors((prev) => ({
				...prev,
				confirmPassword: t("signup.errors.passwordMismatch"),
			}));
		} else if (
			name === "password" &&
			formData.confirmPassword &&
			value !== formData.confirmPassword
		) {
			setErrors((prev) => ({
				...prev,
				confirmPassword: t("signup.errors.passwordMismatch"),
			}));
		} else if (
			name === "confirmPassword" ||
			(name === "password" && formData.confirmPassword === value)
		) {
			setErrors((prev) => ({
				...prev,
				confirmPassword: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.pseudo.trim()) {
			newErrors.pseudo = t("signup.errors.pseudoRequired");
		}

		if (!formData.email) {
			newErrors.email = t("signup.errors.emailRequired");
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = t("signup.errors.emailInvalid");
		}

		if (!formData.password) {
			newErrors.password = t("signup.errors.passwordRequired");
		} else if (formData.password.length < 8) {
			newErrors.password = t("signup.errors.passwordTooShort");
		} else if (
			!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(formData.password)
		) {
			newErrors.password = t("signup.errors.passwordFormat");
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = t("signup.errors.confirmPasswordRequired");
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = t("signup.errors.passwordMismatch");
		}

		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setIsLoading(true);
		setErrors({});

		try {
			const userData = {
				email: formData.email,
				password: formData.password,
        pseudo: formData.pseudo,
			};

			await authService.register(userData);

			navigate("/login", {
				state: { message: t("signup.success") },
			});
		} catch (error) {
			setErrors({
				general: error.message || t("signup.errors.registrationFailed"),
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
					<h1>{t("signup.title")}</h1>

					{errors.general && (
						<div className='error-message general-error'>{errors.general}</div>
					)}

					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<div className='form-group-info'>
								<label htmlFor='pseudo'>
									Pseudo*
									<input
										type='text'
										name='pseudo'
										id='pseudo'
										value={formData.pseudo}
										onChange={handleChange}
										className={errors.pseudo ? "error" : ""}
										required
									/>
									{errors.pseudo && (
										<span className='error-text'>{errors.pseudo}</span>
									)}
								</label>

								<label htmlFor='email'>
									Email*
									<input
										type='email'
										name='email'
										id='email'
										placeholder='email@email.com'
										value={formData.email}
										onChange={handleChange}
										className={errors.email ? "error" : ""}
										autoComplete='email'
										required
									/>
									{errors.email && (
										<span className='error-text'>{errors.email}</span>
									)}
								</label>
							</div>

							<div className='form-group-password'>
								<label htmlFor='password'>
									{t("signup.password")}*
									<div style={{ position: "relative" }}>
										<input
											type={showPassword ? "text" : "password"}
											name='password'
											id='password'
											value={formData.password}
											onChange={handleChange}
											autoComplete='new-password'
											className={errors.password ? "error" : ""}
											minLength='8'
											pattern='^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$'
											title='Le mot de passe doit contenir au moins 8 caractères avec une majuscule, un chiffre et un caractère spécial (!@#$%^&*).'
											required
										/>
										<span
											className='password-toggle'
											onClick={handleTogglePassword}
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
									{errors.password && (
										<span className='error-text'>{errors.password}</span>
									)}
								</label>

								<label htmlFor='confirmPassword'>
									{t("signup.confirmPassword")}*
									<div style={{ position: "relative" }}>
										<input
											type={showPasswordConfirm ? "text" : "password"}
											name='confirmPassword'
											id='confirmPassword'
											value={formData.confirmPassword}
											onChange={handleChange}
											autoComplete='new-password'
											className={errors.confirmPassword ? "error" : ""}
											minLength='8'
											required
										/>
										<span
											className='password-toggle'
											onClick={handleTogglePasswordConfirm}
											style={{
												position: "absolute",
												right: "10px",
												top: "50%",
												transform: "translateY(-50%)",
												cursor: "pointer",
												color: "#293858",
											}}
										>
											{showPasswordConfirm ? (
												<FiEye size={20} />
											) : (
												<FiEyeOff size={20} />
											)}
										</span>
									</div>
									{errors.confirmPassword && (
										<span className='error-text'>{errors.confirmPassword}</span>
									)}
								</label>
							</div>

							<p className='form-group-required'>
								*{t("signup.fieldsRequired")}
							</p>
						</div>

						<button
							type='submit'
							className='submit-button button-primary'
							disabled={isLoading}
						>
              {isLoading ? t('global.loading') : t("signup.continue")}
						</button>
					</form>

					<p>
						{t("signup.alreadyHaveAccount")}
						<NavLink to='/login'> {t("signup.login")}</NavLink>
					</p>
				</div>
			</main>
		</>
	);
}