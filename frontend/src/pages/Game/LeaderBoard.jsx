import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BottomNavBar from "../../components/BottomNavBar";
import Footer from "../../components/Footer";
import { observer } from "mobx-react-lite";

const LeaderBoard = observer(() => {
	const { t } = useTranslation();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const API_URL = import.meta.env.API_BASE_URL || "http://localhost:8000/api";

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(`${API_URL}/users`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (response.ok) {
					const data = await response.json();
					const sortedUsers = data.sort(
						(a, b) => (b.score || 0) - (a.score || 0)
					);
					setUsers(sortedUsers);
				} else {
					throw new Error("Erreur lors de la récupération des données");
				}
			} catch (error) {
				console.error("Erreur lors du chargement du classement:", error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, [API_URL]);

	// Permet d'avoir le bon icon pour le rank
	const getRankIcon = (rank) => {
		switch (rank) {
			case 1:
				return "🥇";
			case 2:
				return "🥈";
			case 3:
				return "🥉";
			default:
				return `${rank}`;
		}
	};

	// Permet de récupérer les 20 premiers utilisateurs
	const getTopUsers = () => {
		return users.slice(0, 20);
	};

	if (loading) {
		return <p className='loading'>{t("global.loading")}</p>;
	}

	return (
		<>
			<BottomNavBar />

			<main className='leaderboard'>
				<h1 className='leaderboard-title'>{t("leaderboard.title")}</h1>

				<div className='leaderboard-content'>
					{users.length === 0 ? (
						<div className='no-data'>
							<p>Aucun joueur dans le classement</p>
						</div>
					) : (
						<>
							{/* Podium pour les 3 premiers */}
							{users.length >= 3 && (
								<div className='leaderboard-podium'>
									{/* 2ème place */}
									<div className='podium-place second'>
										<div className='podium-user'>
											<h3>{users[1].pseudo}</h3>
											<p className='score'>{users[1].score || 0} pts</p>
											<p className='level'>
												{users[1].level && users[1].level.length > 0
													? users[1].level[users[1].level.length - 1].name
													: t("profile.defaultLevel")}
											</p>
										</div>
										<div className='podium-base'>
											<span className='rank'>🥈</span>
											<span className='position'>2</span>
										</div>
									</div>

									{/* 1ère place */}
									<div className='podium-place first'>
										<div className='podium-user'>
											<h3>{users[0].pseudo}</h3>
											<p className='score'>{users[0].score || 0} pts</p>
											<p className='level'>
												{users[0].level && users[0].level.length > 0
													? users[0].level[users[0].level.length - 1].name
													: t("profile.defaultLevel")}
											</p>
										</div>
										<div className='podium-base'>
											<span className='rank'>🥇</span>
											<span className='position'>1</span>
										</div>
									</div>

									{/* 3ème place */}
									<div className='podium-place third'>
										<div className='podium-user'>
											<h3>{users[2].pseudo}</h3>
											<p className='score'>{users[2].score || 0} pts</p>
											<p className='level'>
												{users[2].level && users[2].level.length > 0
													? users[2].level[users[2].level.length - 1].name
													: t("profile.defaultLevel")}
											</p>
										</div>
										<div className='podium-base'>
											<span className='rank'>🥉</span>
											<span className='position'>3</span>
										</div>
									</div>
								</div>
							)}

							{/* Tableau complet */}
							<div className='leaderboard-table-container'>
								<table className='leaderboard-content-table'>
									<thead>
										<tr>
											<th>Rang</th>
											<th>Joueur</th>
											<th>Score</th>
											<th>Niveau</th>
										</tr>
									</thead>
									<tbody>
										{getTopUsers().map((user, index) => (
											<tr
												key={user.id}
												className={index < 3 ? "top-three" : ""}
											>
												<td className='rank-cell'>{getRankIcon(index + 1)}</td>
												<td className='user-cell'>
													<div className='user-info'>
														<p className='username'>{user.pseudo}</p>
													</div>
												</td>
												<td className='score-cell'>
													<strong>{user.score || 0}</strong> pts
												</td>
												<td className='level-cell'>
													<p>
														{user.level && user.level.length > 0
															? user.level[user.level.length - 1].name
															: t("profile.defaultLevel")}
													</p>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</>
					)}
				</div>
			</main>

			<Footer />
		</>
	);
});

export default LeaderBoard;
