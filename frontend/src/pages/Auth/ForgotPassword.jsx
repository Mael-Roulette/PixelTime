import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { useState } from "react";
import authService from "../../../services/authService";

export default function forgotPassword() {
	const { t } = useTranslation();

	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsLoading(true);

		try {
			await authService.forgotPassword(email);
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
							value={isLoading ? t("forgotPassword.loading") : t("forgotPassword.resetPassword")}
							className='submit-button button-primary'
							disabled={isLoading}
						/>
					</form>
					<p>
						{t("forgotPassword.notForgotPassword")}
						<a href='/login'> {t("forgotPassword.login")}</a>
					</p>
				</div>
			</main>
		</>
	);
}
