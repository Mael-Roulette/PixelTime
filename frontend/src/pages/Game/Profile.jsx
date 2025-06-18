import { useEffect, useState } from "react";
import authService from "../../../services/authService";
import BottomNavBar from "../../components/BottomNavBar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router";

const Profile = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [logoutPopupVisible, setLogoutPopupVisible] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true);
				const response = await authService.getUser();
				const userData = response.user;
				setUser(userData);
			} catch (error) {
				console.error(error);
				setError(error.message);
				authService.logout();
				navigate('/login');
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [navigate]);

	if (loading) {
		return (
			<div className='loading'>
				<p>{t("global.loading")}</p>
			</div>
		);
	}

	// Gérer le scroll et l'affichage du popup
	const displayLogoutPopup = () => {
		setLogoutPopupVisible(!logoutPopupVisible);
		if (!logoutPopupVisible) {
			document.body.classList.add("no-scroll");
		} else {
			document.body.classList.remove("no-scroll");
		}
	};

	// Fermer le popup en cliquant sur le fond
	const handlePopupBackgroundClick = (e) => {
		if (e.target === e.currentTarget) {
			setLogoutPopupVisible(false);
			document.body.classList.remove("no-scroll");
		}
	};

	// Fermer le popup avec le bouton annuler
	const handleCancelLogout = () => {
		setLogoutPopupVisible(false);
		document.body.classList.remove("no-scroll");
	};

	const handleLogout = () => {
		authService.logout();
		navigate("/login");
	};

	return (
		<>
			<BottomNavBar />

			<main className='profile'>
				<div className='profile-picture'>
					{user.profilePicture ? (
						<img
							src={user.profilePicture}
							alt={user.pseudo}
							className='profile-picture-image'
						/>
					) : (
						<div className='profile-picture-image'>
							<p>{user.pseudo.charAt(0).toUpperCase()}</p>
						</div>
					)}
				</div>
				<div className='profile-content'>
					<div className='profile-content-informations'>
						<h1>{user.pseudo}</h1>
						<p>{user.email}</p>
					</div>

					<div className='profile-content-stats'>
						<h2>{t("profile.stats")}</h2>
						<ul>
							<li>
								<h3 className='stat-title'>🏅 {t("profile.totalScore")}</h3>
								<p className='stat-value'>{user.score}</p>
							</li>
							<li>
								<h3 className='stat-title'>🏆 {t("profile.level")}</h3>
								{user.level && Object.keys(user.level).length > 0 ? (
									<p className='stat-value'>
										{Object.values(user.level).pop()}
									</p>
								) : (
									<p className='stat-value'>{t("profile.defaultLevel")}</p>
								)}
							</li>
							<li>
								<h3 className='stat-title'>🪙 {t("profile.money")}</h3>
								<p className='stat-value'>{user.money}</p>
							</li>
						</ul>
					</div>
				</div>

				<div className='profile-link'>
					{user.roles && user.roles.includes("ROLE_ADMIN") && (
						<NavLink to='/admin' className='button-tertiary'>
							Accèder à l'espace d'administration
						</NavLink>
					)}

					<button className='button-tertiary' onClick={displayLogoutPopup}>
						{t("global.logout")}
					</button>

					<div
						className={
							`profile-logout-popup` + (logoutPopupVisible ? " visible" : "")
						}
						onClick={handlePopupBackgroundClick}
					>
						<div className='popup-content'>
							<p>{t("global.logoutText")}</p>
							<div className='popup-content-buttons'>
								<button
									className='button-secondary'
									onClick={handleCancelLogout}
								>
									{t("global.cancel")}
								</button>
								<button className='button-primary' onClick={handleLogout}>
									{t("global.logout")}
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
};

export default Profile;
