import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import authService from "../../services/authService";

const UserRoute = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const authenticated = authService.isAuthenticated();

				if (authenticated) {
					const tokenValid = await authService.getUser();
					setIsAuthenticated(tokenValid);
				} else {
					setIsAuthenticated(false);
				}
			} catch (error) {
				console.error("Erreur de vérification d'authentification:", error);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<p>Vérification de l'authentification...</p>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	return children;
};

export default UserRoute;
