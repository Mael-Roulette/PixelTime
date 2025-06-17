import BottomNavBar from "../../components/BottomNavBar";
import Footer from "../../components/Footer";
import { observer } from "mobx-react-lite";
import { useAppStore } from "../../stores/useStore";
import { useEffect, useState } from "react";

const LeaderBoard = observer(() => {
	const appStore = useAppStore();
	const [selectedLevel, setSelectedLevel] = useState("");

	useEffect(() => {
		appStore.fetchLevels();
		appStore.fetchLeaderboard();
	}, [appStore]);

	// Recharger le leaderboard quand le niveau change
	useEffect(() => {
		if (selectedLevel) {
			appStore.fetchLeaderboard(selectedLevel);
		} else {
			appStore.fetchLeaderboard();
		}
	}, [selectedLevel, appStore]);

	const handleLevelChange = (e) => {
		setSelectedLevel(e.target.value);
	};

	if (appStore.loading) {
		return (
			<>
				<BottomNavBar />
				<main className='leaderboard'>
					<div className="loading">
						<p>Chargement du classement...</p>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	return (
		<>
			<BottomNavBar />

			<main className='leaderboard'>
				<h1 className='leaderboard-title'>Classement</h1>

				<section className='leaderboard-content'>
					<select value={selectedLevel} onChange={handleLevelChange}>
						{appStore.levels.map((level) => (
							<option key={level.id} value={level.id}>
								{level.name || `Niveau ${level.id}`}
							</option>
						))}
					</select>

					<table className='leaderboard-content-table'>
						<thead>
							<tr>
								<th>Rang</th>
								<th>Joueur</th>
								<th>Score</th>
							</tr>
						</thead>
						<tbody>
							{appStore.leaderboard && appStore.leaderboard.length > 0 ? (
								appStore.leaderboard.map((entry, index) => (
									<tr key={entry.id || index}>
										<td>{index + 1}</td>
										<td>
											{entry.user?.profile_image && (
												<img
													src={entry.user.profile_image}
													alt={entry.user.username}
													className='profile-image'
												/>
											)}
											{entry.user?.username ||
												entry.username ||
												"Joueur anonyme"}
										</td>
										<td>{entry.score || 0}</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan='3'
										style={{ textAlign: "center", padding: "2rem" }}
									>
										Aucun score disponible pour ce niveau
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</section>
			</main>

			<Footer />
		</>
	);
});

export default LeaderBoard;
