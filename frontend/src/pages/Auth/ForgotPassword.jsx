import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import React, { useState } from "react";

const API_URL = import.meta.env.API_BASE_URL || "http://localhost:8000/api";

function ForgotPassword() {
	const { t } = useTranslation();

	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch(`${API_URL}/forgot-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage(data.message);
			} else {
				setMessage(data.error || "Une erreur est survenue");
			}
		} catch (error) {
			console.error("Erreur:", error);
			setMessage("Erreur de connexion au serveur");
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
					<h1>{t("forgotPassword.title")}</h1>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<label htmlFor='email'>
								Email
								<input
									type='email'
									name='email'
									placeholder='email@email.com'
									onChange={(e) => setEmail(e.target.value)}
									disabled={isLoading}
								/>
							</label>
						</div>
						<input
							type='submit'
							value={
								isLoading
									? t("global.loading")
									: t("forgotPassword.resetPassword")
							}
							className='submit-button button-primary'
							disabled={isLoading}
						/>
					</form>
					{message && <p>{message}</p>}
					<p>
						{t("forgotPassword.notForgotPassword")}
						<NavLink to={"/login"}> {t("forgotPassword.login")}</NavLink>
					</p>
				</div>
			</main>
		</>
	);
}

export default ForgotPassword;
