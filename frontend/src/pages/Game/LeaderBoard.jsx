import BottomNavBar from "../../components/BottomNavBar";
import Footer from "../../components/Footer";
import { observer } from "mobx-react-lite";

const LeaderBoard = observer(() => {
	return (
		<>
			<BottomNavBar />

			<main className='leaderboard'>
				<h1 className='leaderboard-title'>Classement</h1>
			</main>

			<Footer />
		</>
	);
});

export default LeaderBoard;
