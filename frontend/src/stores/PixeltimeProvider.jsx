import GameStore from "./GameModeStore";
import LeaderboardStore from "./LeaderboardStore";
import { PixeltimeContext } from "./pixeltimeContext";

const leaderboardStore = new LeaderboardStore();
const gameStore = new GameStore();

const pixeltimeStore = {
	leaderboardStore,
	gameStore,
};

export const PixeltimeProvider = ({ children }) => {
	return <PixeltimeContext value={pixeltimeStore}>{children}</PixeltimeContext>;
};
