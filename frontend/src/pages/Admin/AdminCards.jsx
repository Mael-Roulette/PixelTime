import { useEffect, useState } from "react";
import BottomNavBar from "../../components/BottomNavBar";
import adminService from "../../../services/adminService";
import Footer from "../../components/Footer";

const AdminCards = () => {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCards = async () => {
			try {
				setLoading(true);
				const response = await adminService.getCards();
				setCards(response);
				console.log(response);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchCards();
	}, []);

	return (
		<>
			<BottomNavBar />

			<main className='admin-cards'>
				<h1 className='admin-cards-title'>Liste des cartes</h1>

				{cards.length === 0 ? (
					<p>Aucune carte</p>
				) : (
					<ul className='card-container-list'>
						{cards.slice(-5).map((card) => {
							return (
								<li key={card.id} className='card-container-list-item'>
									<p className='title'>{card.title}</p>
									<p className='date'>{card.year}</p>
								</li>
							);
						})}
					</ul>
				)}
			</main>

      <Footer />
		</>
	);
};

export default AdminCards;
