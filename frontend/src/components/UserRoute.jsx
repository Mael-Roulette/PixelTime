import { Navigate } from "react-router";
import authService from "../../services/authService";

const UserRoute = ({ children }) => {
	return authService.isAuthenticated() ? children : <Navigate to='/login' />;
};

export default UserRoute;
