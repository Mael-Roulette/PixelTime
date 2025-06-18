import GameModeStore from "./GameModeStore";
import { PixeltimeContext } from "./pixeltimeContext";

const gameStore = new GameModeStore();

const pixeltimeStore = {
	gameStore,
};

export const PixeltimeProvider = ({ children }) => {
	return <PixeltimeContext value={pixeltimeStore}>{children}</PixeltimeContext>;
};
