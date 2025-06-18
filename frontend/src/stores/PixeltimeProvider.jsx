import LeaderboardStore from "./LeaderboardStore";
import { PixeltimeContext } from "./pixeltimeContext";

const leaderboardStore = new LeaderboardStore();

const pixeltimeStore = {
	leaderboardStore,
};

export const PixeltimeProvider = ({ children }) => {
	return <PixeltimeContext value={pixeltimeStore}>{children}</PixeltimeContext>;
};
