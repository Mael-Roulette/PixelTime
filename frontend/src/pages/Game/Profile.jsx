import { useEffect, useState } from "react";
import authService from "../../../services/authService";
import BottomNavBar from "../../components/BottomNavBar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

const Profile = () => {
	const { t } = useTranslation();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true);
				const response = await authService.getUser();
				const userData = response.user;
				console.log(userData);
				setUser(userData);
			} catch (error) {
				console.error(
					"Erreur lors de la récupération de l'utilisateur:",
					error
				);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	if (loading)
		return (
			<div className='loading'>
				<p>{ t("global.loading") }</p>
			</div>
		);

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
						<h2>{ t("profile.stats") }</h2>
						<ul>
							<li>
								<h3 className='stat-title'>🏅 { t("profile.totalScore") }</h3>
								<p className='stat-value'>{user.score}</p>
							</li>
							<li>
								<h3 className='stat-title'>🏆 { t("profile.level") }</h3>
								{user.level && Object.keys(user.level).length > 0 ? (
									<p className='stat-value'>
										{Object.values(user.level).pop()}
									</p>
								) : (
									<p className='stat-value'>{ t("profile.defaultLevel") }</p>
								)}
							</li>
							<li>
								<h3 className='stat-title'>🪙 { t("profile.money") }</h3>
								<p className='stat-value'>{user.money}</p>
							</li>
						</ul>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
};

export default Profile;
