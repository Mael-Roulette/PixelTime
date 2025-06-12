import { useEffect, useState } from "react";
import BottomNavBar from "../../components/BottomNavBar";
import { NavLink } from "react-router";
import adminService from "../../../services/adminService";

const AdminHome = () => {
	const [users, setUsers] = useState([]);
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

		fetchUsers();
	}, []);

	return (
		<>
			<BottomNavBar />

			<main className='admin-home'>
				<h1>Accueil admin</h1>

				<div className='admin-home-informations'>
					<div className='user-container'>
						<h2>Liste des utilisateurs</h2>

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

						<NavLink to='/admin/users' className='button-tertiary'>
							Voir tous les utilisateurs
						</NavLink>
					</div>

					<div className='card-container'>
						<h2>Liste des cartes</h2>
						<p>En construction...</p>
						<NavLink to='#' className='button-tertiary'>
							Voir toutes les cartes
						</NavLink>
					</div>
				</div>
			</main>
		</>
	);
};

export default AdminHome;
