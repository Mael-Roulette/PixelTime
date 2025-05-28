import { observer } from "mobx-react-lite";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Auth/LogIn";
import SignIn from "./pages/Auth/SignIn";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import NewPassword from "./pages/Auth/NewPassword";
import LeaderBoard from "./pages/Game/LeaderBoard";
import GameChoice from "./pages/Game/GameChoice";
import GameBoard from "./pages/Game/GameBoard";
import Catalog from "./pages/Game/Catalog";
import "./App.css";

const App = observer(() => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />}></Route>
				<Route path='/login' element={<Login />}></Route>
				<Route path='/signin' element={<SignIn />}></Route>
				<Route path='/forgotpassword' element={<ForgotPassword />}></Route>
				<Route path='/newpassword' element={<NewPassword />}></Route>
				<Route path='/leaderboard' element={<LeaderBoard />}></Route>
				<Route path="/gamechoice" element={<GameChoice />}></Route>
				<Route path='/gameboard' element={<GameBoard />}></Route>
				<Route path='/catalog' element={<Catalog />}></Route>
			</Routes>
		</BrowserRouter>
	);
});

export default App;
