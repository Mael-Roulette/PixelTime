import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";


export default function GameBoard() {
  const { t } = useTranslation();

  return (
    <>
      <div className="game">
        <div className="game-info-container">
          <NavLink to='/gamechoice' className='game-info-back'>
            {t("game.leave")}
          </NavLink>
          <div className="game-info-center">
            <h1 className="game-info-center-score">{t("game.score")} : </h1>
            <p className="game-info-center-mode">{t("global.classicMode")}</p>
            {/* mettre une fonction qui affiche le nom du mode selon celui choisi */}
          </div>
          <div className="game-info-clue">
            <p className="game-info-clue-text">?</p>
          </div>
        </div>

        <div className="game-board-container">
        </div>

        <div className="game-hand-container">
        </div>
      </div>
    </>
  );
}