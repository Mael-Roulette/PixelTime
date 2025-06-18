import BottomNavBar from "../../components/BottomNavBar";
import Footer from "../../components/Footer";
import { observer } from "mobx-react-lite";
import { useLeaderboardStore } from "../../stores/useStore";

const LeaderBoard = observer(() => {
	const leaderboardStore = useLeaderboardStore();

	console.log( leaderboardStore )
	return (
		<>
			<BottomNavBar />

			<main className='leaderboard'>
				<h1 className='leaderboard-title'>Classement</h1>

				<section className='leaderboard-content'>
					<select>
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
							{/* {leaderboard && leaderboard.length > 0 ? (
								leaderboard.map((entry, index) => (
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
							)} */}
						</tbody>
					</table>
				</section>
			</main>

			<Footer />
		</>
	);
});

export default LeaderBoard;
