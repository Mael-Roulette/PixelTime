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
	const [isCardPlacing, setIsCardPlacing] = useState(false);
	const [previewPosition, setPreviewPosition] = useState(null);

	useEffect(() => {
		if (!mode) {
			navigate("/gamechoice");
		}

		if (!gameStore.loading) {
			gameStore.play();
		}
	}, [mode, navigate, gameStore]);

	const handleQuitGame = async () => {
		await gameStore.quitGame();
		navigate("/gamechoice");
	};

	const handleAddCard = () => {
		if (!isCardPlacing) {
			setIsCardPlacing(true);
			setPreviewPosition(0);
		} else if (gameStore.cards.length > 0 && previewPosition !== null) {
			gameStore.dropCard(gameStore.cards[0], previewPosition);
			setIsCardPlacing(false);
			setPreviewPosition(null);
		}
	};

	const handlePreviousPosition = () => {
		if (!isCardPlacing) {
			setIsCardPlacing(true);
			setPreviewPosition(0);
		} else if (previewPosition > 0) {
			setPreviewPosition(previewPosition - 1);
		}
	};

	const handleNextPosition = () => {
		if (!isCardPlacing) {
			setIsCardPlacing(true);
			setPreviewPosition(0);
		} else {
			const maxPosition = gameStore.placedCards.length;
			if (previewPosition < maxPosition) {
				setPreviewPosition(previewPosition + 1);
			}
		}
	};

	const isTouchedDevice = window.matchMedia("(pointer: coarse)").matches;
	const backend = isTouchedDevice ? TouchBackend : HTML5Backend;

	if (gameStore.loading) {
		return <p className='loading'>Chargement du jeu...</p>;
	}

	return (
		<>
			<div className='game'>
				<HUD score={gameStore.score} mode={mode} onQuit={handleQuitGame} />

				<DndProvider backend={backend}>
					<div className='game-board'>
						<GameTimeline
							previewPosition={previewPosition}
							previewCard={
								gameStore.cards.length > 0 ? gameStore.cards[0] : null
							}
						/>
					</div>

					<div className='game-hand'>
						<div className='game-hand-card'>
							{gameStore.cards.length > 0 && (
								<ZoneDraggable
									key={gameStore.cards[0].id}
									index={gameStore.cards[0].id}
									card={gameStore.cards[0]}
								/>
							)}
							{/* Ajouter le bouton d'indice */}
						</div>
						<div className='game-hand-buttons'>
							<button
								className='button-primary'
								onClick={handlePreviousPosition}
								disabled={isCardPlacing && previewPosition === 0}
							>
								{t("game.previous")}
							</button>
							<button
								className='button-primary'
								onClick={handleAddCard}
								disabled={gameStore.cards.length === 0}
							>
								{isCardPlacing ? t("game.validate") : t("game.addCard")}
							</button>
							<button
								className='button-primary'
								onClick={handleNextPosition}
								disabled={
									isCardPlacing &&
									previewPosition >= gameStore.placedCards.length
								}
							>
								{t("game.next")}
							</button>
						</div>
					</div>
				</DndProvider>
			</div>
		</>
	);
});

export default GameBoard;
