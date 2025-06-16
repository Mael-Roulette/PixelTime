import { useNavigate } from "react-router";
import authService from "../../services/authService";

const UserRoute = ({ children }) => {
	const navigate = useNavigate();
	return authService.isAuthenticated() ? children : navigate('/login');
};

export default UserRoute;
