import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import authService from "../../services/authService";

const AdminRoute = ({ children }) => {
	const navigate = useNavigate();
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAdminStatus = async () => {
			if (!authService.isAuthenticated()) {
				setIsLoading(false);
				return;
			}

			try {
				const adminStatus = await authService.isAdmin();
				setIsAdmin(adminStatus);
			} catch (error) {
				console.error("Erreur lors de la vérification du statut admin:", error);
				setIsAdmin(false);
				navigate("/gamechoice");
			} finally {
				setIsLoading(false);
			}
		};

		checkAdminStatus();
	}, [navigate]);

	if (isLoading) {
		return (
			<div className='loading'>
				<p>Vérification des permissions...</p>
			</div>
		);
	}

	if (!authService.isAuthenticated()) {
		navigate("/login");
	}

	if (!isAdmin) {
		navigate("/gamechoice");
	}

	return children;
};

export default AdminRoute;
