import BottomNavBar from "../../components/BottomNavBar";
import CardMode from "../../components/gameUi/CardMode";
import { useTranslation } from "react-i18next";

export default function GameChoice() {
	const { t } = useTranslation();

	return (
		<>
			<BottomNavBar />

			<div className='game-choice-container'>
				<h1 className='game-choice-title'>{t("gameChoice.title")}</h1>

				<div className='game-choice-list'>
					<CardMode
						title={t("global.classicMode")}
						description={t("gameChoice.classicModeDescription")}
						type={"classique"}
						image={"/fond-classique.webp"}
					/>

					<CardMode
						title={t("global.chronoMode")}
						description={t("gameChoice.chronoModeDescription")}
						type={"chrono"}
						image={"/fond-chrono.webp"}
					/>

					<CardMode
						title={t("global.livesMode")}
						description={t("gameChoice.livesModeDescription")}
						type={"survie"}
						image={"/fond-vies.webp"}
					/>
				</div>
			</div>
		</>
	);
}
