import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router";
import HUD from "../../components/gameUi/HUD";
import { useEffect } from "react";

export default function GameBoard() {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const mode = searchParams.get("type");
	const navigate = useNavigate();

	useEffect(() => {
		if (!mode) {
			navigate("/gamechoice");
		}
	}, [mode, navigate]);

	return (
		<>
			<div className='game'>
				<HUD score={0} mode={mode} description={t("game.description")} />

				<div className='game-board-container'></div>

				<div className='game-hand-container'></div>
			</div>
		</>
	);
}
