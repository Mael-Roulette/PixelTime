import { useEffect, useState } from "react";
import BottomNavBar from "../../components/BottomNavBar";
import { NavLink } from "react-router";
import adminService from "../../../services/adminService";
import Footer from "../../components/Footer";

const AdminHome = () => {
	const [users, setUsers] = useState([]);
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);

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

  return (
    <>
      <BottomNavBar />

      <main className='admin-home'>
        <h1>Espace admin</h1>

        <div className='admin-home-informations'>
          <div className='user-container'>
            <h2>Liste des utilisateurs</h2>

            {users.length === 0 ? (
              <p>Aucun utilisateur</p>
            ) : (
              <ul className='user-container-list'>
                {users.slice(-5).map((user) => {
                  return (
                    <li key={user.id} className='user-container-list-item'>
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
                        <p className='info-pseudo'>{user.pseudo}</p>
                        <p className='info-mail'>{user.email}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <NavLink to='/admin/users' className='button-tertiary user-container-seemore'>
              Voir tous les utilisateurs
            </NavLink>
          </div>

          <div className='card-container'>
            <h2>Liste des cartes</h2>

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

            <NavLink to='/admin/cards' className='button-tertiary card-container-seemore'>
              Voir toutes les cartes
            </NavLink>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AdminHome;
