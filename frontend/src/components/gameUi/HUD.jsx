import { useTranslation } from "react-i18next";
import { useState } from "react";

const HUD = ({ score, mode, lives, timeLeft, onQuit }) => {
	const { t } = useTranslation();
	const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

	const toggleDescription = () => {
		setIsDescriptionVisible(!isDescriptionVisible);
		if (!isDescriptionVisible) {
			document.body.classList.add("no-scroll");
		} else {
			document.body.classList.remove("no-scroll");
		}
	};

	// Fermer le popup en cliquant sur le fond
	const handlePopupBackgroundClick = (e) => {
		if (e.target === e.currentTarget) {
			setIsDescriptionVisible(false);
			document.body.classList.remove("no-scroll");
		}
	};

	// Fermer le popup avec le bouton fermer
	const handleCloseDescription = () => {
		setIsDescriptionVisible(false);
		document.body.classList.remove("no-scroll");
	};

	return (
		<div className='game-info-container'>
			<div className='game-info-container-primary'>
				<button className='game-info-back' onClick={onQuit}>
					{t("game.leave")}
				</button>
				<div className='game-info-center'>
					<h1 className='game-info-center-score'>
						{t("game.score")} : {score}
					</h1>
					{mode === "classic" && (
						<p className='game-info-center-mode'>{t("global.classicMode")}</p>
					)}
					{mode === "chrono" && (
						<p className='game-info-center-mode'>{t("global.chronoMode")}</p>
					)}
					{mode === "lives" && (
						<p className='game-info-center-mode'>{t("global.livesMode")}</p>
					)}
				</div>

				<button className='game-info-description' onClick={toggleDescription}>
					<p className='game-info-description-text'>?</p>
				</button>
			</div>

			<div className='game-info-container-secondary'>
				{mode === "lives" && (
					<div className='lives'>
						{Array.from({ length: lives }, (_, index) => (
							<p key={index} className='heart'>
								❤️
							</p>
						))}
					</div>
				)}
				{mode === "chrono" && (
					<div className='time'>
						<p className='time-value'>{Math.max(0, timeLeft)}s</p>
					</div>
				)}
			</div>

			<div
				className={`description-popup${isDescriptionVisible ? " visible" : ""}`}
				onClick={handlePopupBackgroundClick}
			>
				<div className='popup-content'>
					{mode === "classic" && (
						<p>{t("gameChoice.classicModeDescription")}</p>
					)}
					{mode === "chrono" && <p>{t("gameChoice.chronoModeDescription")}</p>}
					{mode === "lives" && <p>{t("gameChoice.livesModeDescription")}</p>}
					<button className='button-secondary' onClick={handleCloseDescription}>
						{t("global.close")}
					</button>
				</div>
			</div>
		</div>
	);
};
export default HUD;
