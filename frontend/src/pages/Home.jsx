// import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// import { api } from "../services/api";
import Header from "../components/Header";
import { NavLink } from "react-router";
import Footer from "../components/Footer";

export default function Home() {
	const { t } = useTranslation();
	// const [users, setUsers] = useState([]);
	// const [loading, setLoading] = useState(true);
	// const [error, setError] = useState(null);

	// useEffect(() => {
	// 	setLoading(true);
	// 	api
	// 		.get("/users")
	// 		.then((response) => {
	// 			setUsers(response);
	// 		})
	// 		.catch((err) => {
	// 			console.error("Failed to fetch users:", err);
	// 			setError(err.message);
	// 		})
	// 		.finally(() => {
	// 			setLoading(false);
	// 		});
	// }, []);

	return (
		<>
			<Header />

			<main className="home">
				<section className="banner">
					<div className="banner-content">
						<h1 className="banner-content-title">{t("home.title")}</h1>
						<p className="banner-content-description">{t("home.description")}</p>
						<div className="banner-content-buttons">
							<NavLink to={"/login"} className="button-primary">{t("global.login")}</NavLink>
							<NavLink to={"/signin"} className="button-secondary">{t("global.signup")}</NavLink>
						</div>
					</div>
				</section>

			</main>

			<Footer />
		</>
	);
}
