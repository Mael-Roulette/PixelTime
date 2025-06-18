import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const HUD = ({ score = 0, mode, description }) => {
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
        <div className="game-info-container">
            <NavLink to='/gamechoice' className='game-info-back'>
                {t("game.leave")}
            </NavLink>
            <div className="game-info-center">
                <h1 className="game-info-center-score">{t("game.score")} : {score}</h1>
                {mode === "classic" && (
                    <p className="game-info-center-mode">{t("global.classicMode")}</p>
                )}
                {mode === "chrono" && (
                    <p className="game-info-center-mode">{t("global.chronoMode")}</p>
                )}
                {mode === "lives" && (
                    <p className="game-info-center-mode">{t("global.livesMode")}</p>
                )}
            </div>

            <button className="game-info-description" onClick={toggleDescription}>
                <p className="game-info-description-text">?</p>
            </button>

            <div
                className={`description-popup${isDescriptionVisible ? " visible" : ""}`}
                onClick={handlePopupBackgroundClick}
            >
                <div className='popup-content'>
                    {mode === "classic" && (
                        <p>{t("gameChoice.classicModeDescription")}</p>
                    )}
                    {mode === "chrono" && (
                        <p>{t("gameChoice.chronoModeDescription")}</p>
                    )}
                    {mode === "lives" && (
                        <p>{t("gameChoice.livesModeDescription")}</p>
                    )}
                    <button className='button-secondary' onClick={handleCloseDescription}>
                        {t("global.close")}
                    </button>
                </div>
            </div>
        </div>
    )
}
export default HUD;