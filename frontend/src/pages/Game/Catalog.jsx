import { useTranslation } from "react-i18next";
import BottomNavBar from "../../components/BottomNavBar";
import { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import Card from "../../components/gameUi/Card";
import Footer from "../../components/Footer";

export default function Catalog() {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const { t } = useTranslation();
	const [isMobile, setIsMobile] = useState(false);

	const fetchCards = async () => {
		try {
			const response = await adminService.getCards();
			setCards(response);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);
		fetchCards();


		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	if (loading) {
		return <p className="loading">Chargement des cartes...</p>
	}

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
					{cards
						.sort((a, b) => a.year - b.year)
						.map((card) => {
							return (
								<li key={card.id} className='catalog-list-item'>
									<div className='flip-card'>
										<div className='flip-card-inner'>
											<Card card={card} isCatalog={true} />
										</div>
									</div>
								</li>
							);
						})}
				</ul>
			</main>

			<Footer />
		</>
	);
}
