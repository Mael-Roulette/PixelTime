import { useEffect, useState } from "react";
import BottomNavBar from "../../components/BottomNavBar";
import adminService from "../../../services/adminService";
import Footer from "../../components/Footer";

const AdminUsers = () => {
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

			<main className="admin-users">
				<h1 className="admin-users-title">Liste des utilisateurs</h1>

				<ul className='user-container-list'>
					{users.map((user) => {
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
			</main>

      <Footer />
		</>
	);
};

export default AdminUsers;