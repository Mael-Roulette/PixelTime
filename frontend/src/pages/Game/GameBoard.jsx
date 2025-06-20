import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import GameTimeline from "../../components/gameUi/GameTimeline";
import HUD from "../../components/gameUi/HUD";
import ZoneDraggable from "../../components/gameUi/ZoneDraggable";
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
	const [isHintVisible, setIsHintVisible] = useState(false);

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

	useEffect(() => {
		if (!mode) {
			navigate("/gamechoice");
			return;
		}

		if (currentModeRef.current !== mode) {
			currentModeRef.current = mode;
			setInitialized(false);
			switchGameMode(mode);
		}
	}, [mode, navigate, switchGameMode]);

	useEffect(() => {
		if (!initialized && currentModeRef.current === mode && !gameStore.loading) {
			setInitialized(true);

			if (gameStore.hasGameInProgress()) {
				setShowResumeDialog(true);
			} else {
				setIsCardPlacing(false);
				setPreviewPosition(null);
				gameStore.play();
			}
		}
	}, [initialized, mode, gameStore]);

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

	const toggleHint = () => {
		setIsHintVisible(!isHintVisible);
		if (!isHintVisible) {
			document.body.classList.add("no-scroll");
		} else {
			document.body.classList.remove("no-scroll");
		}
	};

	// Fermer le popup en cliquant sur le fond
	const handlePopupBackgroundClick = (e) => {
		if (e.target === e.currentTarget) {
			setIsHintVisible(false);
			document.body.classList.remove("no-scroll");
		}
	};

	// Fermer le popup avec le bouton fermer
	const handleCloseHint = () => {
		setIsHintVisible(false);
		document.body.classList.remove("no-scroll");
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
						<h3>{t("game.resume.title")}</h3>
						<p>{t("game.resume.description")}</p>
						<div className='resume-dialog-buttons'>
							<button className='button-secondary' onClick={handleNewGame}>
								{t("game.resume.newGame")}
							</button>
							<button className='button-primary' onClick={handleResumeGame}>
								{t("game.resume.resumeGame")}
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
							{gameStore.cards.length > 0 && !gameStore.isGameFinished ? (
								<>
									<ZoneDraggable
										key={gameStore.cards[0].id}
										index={gameStore.cards[0].id}
										card={gameStore.cards[0]}
									/>

									<button className='game-hand-card-hint' onClick={toggleHint}>
										<p className='game-hand-card-hint-text'>?</p>
									</button>

									<div
										className={`hint-popup${isHintVisible ? " visible" : ""}`}
										onClick={handlePopupBackgroundClick}
									>
										<div className='popup-content'>
											<p>{gameStore.cards[0].hint}</p>
											<button
												className='button-secondary'
												onClick={handleCloseHint}
											>
												{t("global.close")}
											</button>
										</div>
									</div>
								</>
							) : (
								<div className='game-finished-message'>
									<p>
										{gameStore.isGameOver()
											? t("game.gameOver")
											: t("game.finished")}
									</p>
								</div>
							)}
							{/* Ajouter le bouton d'indice */}
						</div>
						<div className='game-hand-buttons'>
							{gameStore.isGameFinished ? (
								<>
									<button className='button-secondary' onClick={handleQuitGame}>
										{t("game.leave")}
									</button>
									<button className='button-primary' onClick={handleNewGame}>
										{t("game.playAgain")}
									</button>
								</>
							) : (
								<>
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
								</>
							)}
						</div>
					</div>
				</DndProvider>
			</div>
		</>
	);
});

export default GameBoard;
