import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import HUD from "../../components/gameUi/HUD";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import ZoneDraggable from "../../components/gameUi/ZoneDraggable";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import GameTimeline from "../../components/gameUi/GameTimeline";
import LivesModeStore from "../../stores/LivesModeStore";
import ChronoModeStore from "../../stores/ChronoModeStore";
import GameModeStore from "../../stores/GameModeStore";
import { useGameStore, useSwitchGameMode } from "../../stores/useStore";

const GameBoard = observer(() => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { t } = useTranslation();
	const mode = searchParams.get("type");

	const switchGameMode = useSwitchGameMode();
	const gameStore = useGameStore();
	const [isCardPlacing, setIsCardPlacing] = useState(false);
	const [previewPosition, setPreviewPosition] = useState(null);
	const [showResumeDialog, setShowResumeDialog] = useState(false);

	const [initialized, setInitialized] = useState(false);
	const currentModeRef = useRef(null);

	useEffect(() => {
		if (!mode) {
			navigate("/gamechoice");
		}

		if (!gameStore.loading) {
			gameStore.play();
		}
	}, [mode, navigate, gameStore]);

	// useEffect(() => {
	// 	if (!mode) {
	// 		navigate("/gamechoice");
	// 		return;
	// 	}

	// 	if (currentModeRef.current !== mode) {
	// 		console.log("🔄 Switching to mode:", mode);
	// 		currentModeRef.current = mode;
	// 		setInitialized(false);
	// 		switchGameMode(mode);
	// 	}
	// }, [mode, navigate, switchGameMode]);

	// useEffect(() => {
	// 	if (!initialized && currentModeRef.current === mode && !gameStore.loading) {
	// 		console.log("🎮 Initializing game for mode:", mode);
	// 		setInitialized(true);

	// 		if (gameStore.hasGameInProgress()) {
	// 			setShowResumeDialog(true);
	// 		} else {
	// 			// Réinitialiser les états locaux
	// 			setIsCardPlacing(false);
	// 			setPreviewPosition(null);
	// 			gameStore.play();
	// 		}
	// 	}
	// }, [initialized, mode, gameStore.loading]);

	const handleResumeGame = () => {
		gameStore.play();
		setShowResumeDialog(false);
	};

	const handleNewGame = () => {
		gameStore.resetGame();
		setIsCardPlacing(false);
		setPreviewPosition(null);
		gameStore.play();
		setShowResumeDialog(false);
	};

	const handleQuitGame = async () => {
		await gameStore.quitGame();
		// Réinitialiser les états
		currentModeRef.current = null;
		setInitialized(false);
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
			{showResumeDialog && (
				<div className='resume-dialog'>
					<div className='resume-dialog-content'>
						<h3>Partie en cours détectée</h3>
						<p>
							Voulez-vous reprendre votre partie en cours ou commencer une
							nouvelle partie ?
						</p>
						<div className='resume-dialog-buttons'>
							<button className='button-secondary' onClick={handleNewGame}>
								Nouvelle partie
							</button>
							<button className='button-primary' onClick={handleResumeGame}>
								Reprendre
							</button>
						</div>
					</div>
				</div>
			)}

			<div className='game'>
				<HUD
					score={gameStore.score}
					mode={mode}
					lives={gameStore.lives}
					timeLeft={gameStore.timeLeft}
					onQuit={handleQuitGame}
				/>

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
							{gameStore.cards.length > 0 ? (
								<ZoneDraggable
									key={gameStore.cards[0].id}
									index={gameStore.cards[0].id}
									card={gameStore.cards[0]}
								/>
							) : (
								<div className='game-finished-message'>
									<p>{t("game.finished")}</p>
								</div>
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
