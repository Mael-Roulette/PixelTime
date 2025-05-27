import { observer } from "mobx-react-lite";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Auth/LogIn";
import SignIn from "./pages/Auth/SignIn";
import ForgotPassword from "./pages/Auth/ForgotPassword";
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
				<Route path='/connexion' element={<Login />}></Route>
				<Route path='/inscription' element={<SignIn />}></Route>
				<Route path='/motdepasseoublie' element={<ForgotPassword />}></Route>
				<Route path='/classement' element={<LeaderBoard />}></Route>
				<Route path="/choix-mode-jeu" element={<GameChoice />}></Route>
				<Route path='/plateau-de-jeu' element={<GameBoard />}></Route>
				<Route path='/catalogue' element={<Catalog />}></Route>
			</Routes>
		</BrowserRouter>
	);
});

export default App;
