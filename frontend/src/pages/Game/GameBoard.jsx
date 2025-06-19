import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router";
import HUD from "../../components/gameUi/HUD";
import { useEffect } from "react";
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

		console.log(gameStore);
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
				<HUD score={0} mode={mode} description={t("game.description")} />

				<DndProvider backend={backend}>
					<div className='game-board'>
						<GameTimeline />
					</div>

					<div className='game-hand'>
						<div className='game-hand-card'>
							{/* Ajouter le bouton d'indice */}
							{gameStore.cards.map((card) => (
								<ZoneDraggable key={card.id} index={card.id} card={card} />
							))}
						</div>
						<div className='game-hand-buttons'>
							{/* Ajouter les boutons d'accessibilité */}
						</div>
					</div>
				</DndProvider>
			</div>
		</>
	);
});

export default GameBoard;
