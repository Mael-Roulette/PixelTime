import { useEffect, useState } from "react";
import BottomNavBar from "../../components/BottomNavBar";
import { NavLink } from "react-router";
import adminService from "../../../services/adminService";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { MdDeleteForever } from "react-icons/md";

const AdminHome = () => {
	const { t } = useTranslation();

	const [users, setUsers] = useState([]);
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [deletePopupVisible, setDeletePopupVisible] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const response = await adminService.getUsers();
				setUsers(response);
				console.log(response);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

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

		fetchUsers();
		fetchCards();
	}, []);

	const displayDeletePopup = (userId) => {
		setUserToDelete(userId);
		setDeletePopupVisible(!deletePopupVisible);
		if (!deletePopupVisible) {
			document.body.classList.add("no-scroll");
		} else {
			document.body.classList.remove("no-scroll");
		}
	};

	// Fermer le popup en cliquant sur le fond
	const handlePopupBackgroundClick = (e) => {
		if (e.target === e.currentTarget) {
			setDeletePopupVisible(false);
			setUserToDelete(null);
			document.body.classList.remove("no-scroll");
		}
	};

	// Fermer le popup avec le bouton annuler
	const handleCancelDelete = () => {
		setDeletePopupVisible(false);
		setUserToDelete(null);
		document.body.classList.remove("no-scroll");
	};

	// permet de supprimer un utilisateur
	const handleDelete = async () => {
		if (userToDelete) {
			try {
				const result = await adminService.deleteUser(userToDelete);
				if (result.success) {
					setUsers(users.filter((user) => user.id !== userToDelete));
					console.log("Utilisateur supprimé avec succès");
				} else {
					console.error("Erreur lors de la suppression:", result.error);
				}
			} catch (error) {
				console.error("Erreur lors de la suppression:", error);
			} finally {
				setDeletePopupVisible(false);
				setUserToDelete(null);
				document.body.classList.remove("no-scroll");
			}
		}
	};

	return (
		<>
			<BottomNavBar />

			<main className='admin-home'>
				<h1>{t("admin.homeTitle")}</h1>

				<div className='admin-home-informations'>
					<div className='user-container'>
						<h2>{t("admin.user.title")}</h2>

						{users.length === 0 ? (
							<p>Aucun utilisateur</p>
						) : (
							<ul className='user-container-list'>
								{users.slice(-5).map((user) => {
                  return (
                    <li key={user.id} className='user-container-list-item'>
                      <div className='user-container-list-item-content'>
                        <div className='photo'>
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.pseudo} />
                          ) : (
                            <div className='profile-initial'>
                              <p>{user.pseudo?.charAt(0).toUpperCase()}</p>
                            </div>
                          )}
                        </div>

                        <div className='info'>
                          <p className='info-pseudo'>
                            {user.pseudo}
                            {user.role && user.role.includes("ROLE_ADMIN") && " (Admin)"}
                          </p>
                          <p className='info-mail'>{user.email}</p>
                        </div>
                      </div>

                      <button
                        className='delete-button'
                        onClick={() => displayDeletePopup(user.id)}
                      >
                        <MdDeleteForever size={25} />
                      </button>
                    </li>
                  );
								})}
							</ul>
						)}

						<div
							className={
								`delete-popup` + (deletePopupVisible ? " visible" : "")
							}
							onClick={handlePopupBackgroundClick}
						>
							<div className='popup-content'>
								<p>
									Êtes vous sur de supprimer cet utilisateur ? Cette action est
									irréversible.
								</p>
								<div className='popup-content-buttons'>
									<button
										className='button-secondary'
										onClick={handleCancelDelete}
									>
										{t("global.cancel")}
									</button>
									<button className='button-primary' onClick={handleDelete}>Supprimer</button>
								</div>
							</div>
						</div>

						<NavLink
							to='/admin/users'
							className='button-tertiary user-container-seemore'
						>
							{t("admin.user.seeAll")}
						</NavLink>
					</div>

					<div className='card-container'>
						<h2>{t("admin.card.title")}</h2>

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

						<NavLink
							to='/admin/cards'
							className='button-tertiary card-container-seemore'
						>
							{t("admin.card.seeAll")}
						</NavLink>
					</div>
				</div>
			</main>

			<Footer />
		</>
	);
};

export default AdminHome;
