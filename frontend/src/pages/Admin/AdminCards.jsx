import { useEffect, useState } from "react";
import BottomNavBar from "../../components/BottomNavBar";
import adminService from "../../../services/adminService";
import Footer from "../../components/Footer";
import {
	Navigate,
	NavLink,
	Outlet,
	useLocation,
	useNavigate,
} from "react-router";
import Card from "../../components/gameUi/Card";

const AdminCards = () => {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	const isOnMainRoute = location.pathname === "/admin/cards";

	const fetchCards = async () => {
		try {
			setLoading(true);
			const response = await adminService.getCards();
			setCards(response);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCards();
	}, []);

	const handleAdd = () => {
		navigate("add");
	};

	const handleCardAdded = () => {
		fetchCards();
	};

	return (
		<>
			<BottomNavBar />

			<main className='admin-cards'>
				<section className='admin-cards-content'>
					<NavLink to='/admin' className='admin-back'>
						Retour
					</NavLink>
					<div className='admin-cards-header'>
						<h1 className='admin-cards-title'>Liste des cartes</h1>
						<button className='button-primary' onClick={() => handleAdd()}>
							Ajouter une carte
						</button>
					</div>

					{cards.length === 0 ? (
						<p>Aucune carte</p>
					) : (
						<ul className='card-container-list'>
							{cards.slice(-5).map((card) => {
								return (
									<li key={card.id} className='card-container-list-item'>
										<Card
											title={card.title}
											image={card.image}
											year={card.year}
											description={card.description}
											hint={card.hint}
										/>
									</li>
								);
							})}
						</ul>
					)}
				</section>

				<aside
					className={`admin-cards-add ${isOnMainRoute ? "hidden" : ""}`}
					aria-label="Ajout d'une carte"
				>
					<Outlet context={{ onCardAdded: handleCardAdded }} />
				</aside>
			</main>

			<Footer />
		</>
	);
};

export default AdminCards;
