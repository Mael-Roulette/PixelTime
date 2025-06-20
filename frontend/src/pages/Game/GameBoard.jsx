import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router";
import HUD from "../../components/gameUi/HUD";
import { useEffect, useState } from "react";
import { useGameStore } from "../../stores/useStore";
import { observer } from "mobx-react-lite";
import ZoneDraggable from "../../components/gameUi/ZoneDraggable";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import GameTimeline from "../../components/gameUi/GameTimeline";

const GameBoard = observer(() => {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const mode = searchParams.get("type");
	const navigate = useNavigate();

	const gameStore = useGameStore();

	useEffect(() => {
		if (!mode) {
			navigate("/gamechoice");
		}

		if (!gameStore.loading) {
			gameStore.play();
		}
	}, [mode, navigate, gameStore]);

	const isTouchedDevice = window.matchMedia("(pointer: coarse)").matches;
	const backend = isTouchedDevice ? TouchBackend : HTML5Backend;

	if (gameStore.loading) {
		return <p className='loading'>Chargement du jeu...</p>;
	}

	return (
		<>
			<div className='game'>
				<HUD score={gameStore.score} mode={mode} description={t("game.description")} />

				<DndProvider backend={backend}>
					<div className='game-board'>
						<GameTimeline />
					</div>

					<div className='game-hand'>
						<div className='game-hand-card'>
							{gameStore.cards.length > 0 && (
								<ZoneDraggable key={gameStore.cards[0].id} index={gameStore.cards[0].id} card={gameStore.cards[0]} />
							)}
							{/* Ajouter le bouton d'indice */}
						</div>
						<div className='game-hand-buttons'>
							{/* Ajouter les boutons d'accessibilité */}
							<button className='button-primary'>{t("game.previous")}</button>
							<button className='button-primary'>{t("game.addCard")}</button>
							<button className='button-primary'>{t("game.next")}</button>
						</div>
					</div>
				</DndProvider>
			</div>
		</>
	);
});

export default GameBoard;
