import BottomNavBar from "../../components/BottomNavBar";
import Footer from "../../components/Footer";
import CardMode from "../../components/gameUi/CardMode";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

export default function GameChoice() {
	const { t } = useTranslation();

	return (
		<>
			<BottomNavBar />

			<section className='game-choice-container'>
				<h1 className='game-choice-title'>{t("gameChoice.title")}</h1>

				<div className='game-choice-list'>
					<CardMode
						title={t("global.classicMode")}
						description={t("gameChoice.classicModeDescription")}
						type={"classic"}
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
						type={"lives"}
						image={"/fond-vies.webp"}
					/>
				</div>

				<NavLink to='/catalog' className='game-choice-catalog'>
					{t("gameChoice.trainingWithCatalog")}
				</NavLink>
			</section>

			<Footer />
		</>
	);
}
