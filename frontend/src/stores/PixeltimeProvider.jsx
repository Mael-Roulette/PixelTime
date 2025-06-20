import { useState } from "react";
import GameModeStore from "./GameModeStore";
import LivesModeStore from "./LivesModeStore";
import ChronoModeStore from "./ChronoModeStore";
import { PixeltimeContext } from "./pixeltimeContext";

export const PixeltimeProvider = ({ children }) => {
	const [gameStore, setGameStore] = useState(() => new GameModeStore());

	const switchGameMode = (mode) => {
		if (gameStore.hasGameInProgress()) {
			gameStore.saveGameState();
		}

		let newStore;
		switch (mode) {
			case "lives":
				newStore = new LivesModeStore();
				break;
			case "chrono":
				newStore = new ChronoModeStore();
				break;
			default:
				newStore = new GameModeStore();
		}

		setGameStore(newStore);
	};

	const pixeltimeStore = {
		gameStore,
		switchGameMode,
	};

	return <PixeltimeContext value={pixeltimeStore}>{children}</PixeltimeContext>;
};
