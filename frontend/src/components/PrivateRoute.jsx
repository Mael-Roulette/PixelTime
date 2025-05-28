import { Navigate } from "react-router";
import authService from "../../services/authService";

const PrivateRoute = ({ children }) => {
	return authService.getCurrentUser() ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
