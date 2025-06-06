import { useTranslation } from "react-i18next";
import { NavLink, useSearchParams } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";

import { FiEye, FiEyeOff } from "react-icons/fi";

function NewPassword() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [type, setType] = useState("password");
	const [showPassword, setShowPassword] = useState(false);

	const [params] = useSearchParams();
	const token = params.get("token");

	if (!token) {
		navigate("/login");
		return null;
	}

	const handleToggle = () => {
		setShowPassword(!showPassword);
		setType(showPassword ? "password" : "text");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirm) {
			alert("Les mots de passe ne correspondent pas");
			return;
		}

		const res = await fetch(`http://localhost:8000/reset-password/${token}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		});

		if (res.ok) {
			alert("Mot de passe modifié avec succès");
			window.location.href = "/login";
		} else {
			alert("Erreur lors de la réinitialisation");
		}
	};

	return (
		<>
			<header className='header-login'>
				<NavLink to={"/"}>{t("global.backHome")}</NavLink>
			</header>

			<main className='main-login'>
				<div className='main-login-form'>
					<h1>{t("newPassword.title")}</h1>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<label htmlFor='password'>
								{t("newPassword.password")}
								<div style={{ position: "relative" }}>
									<input
										type={type}
										name='password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										autoComplete='current-password'
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
							</label>
							<label htmlFor='password-confirm'>
								{t("newPassword.confirmPassword")}
								<div style={{ position: "relative" }}>
									<input
										type={type}
										name='password-confirm'
										value={confirm}
										onChange={(e) => setConfirm(e.target.value)}
										autoComplete='current-password'
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
							</label>
						</div>
						<input
							type='submit'
							value={t("login.continue")}
							className='submit-button button-primary'
						/>
					</form>
					<p>
						{t("login.noAccount")}
						<a href='/login'> {t("login.signup")}</a>
					</p>
					<p>
						<a href='/forgotpassword'> {t("login.forgotPassword")}</a>
					</p>
				</div>
			</main>
		</>
	);
}

export default NewPassword;