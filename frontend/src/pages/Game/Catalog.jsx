import { useTranslation } from "react-i18next";
import BottomNavBar from "../../components/BottomNavBar";
import { useEffect, useState } from "react";
import Card from "../../components/gameUi/Card";

export default function Catalog() {
	const { t } = useTranslation();

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);

		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	return (
		<>
			<BottomNavBar />

			<main className='catalog'>
				<h1 className='catalog-title'>{t("cardsCatalog.title")}</h1>
				<p className='catalog-description'>
					{isMobile
						? t("cardsCatalog.descriptionMobile")
						: t("cardsCatalog.descriptionPC")}
				</p>

				<ul className="catalog-list">
					
					<li className="catalog-list-item">
						<Card />
					</li>
				</ul>
			</main>
		</>
	);
}
