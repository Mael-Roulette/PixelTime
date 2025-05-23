import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";

export default function Home() {
	const { t } = useTranslation();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		api
			.get("/users")
			.then((response) => {
				setUsers(response);
			})
			.catch((err) => {
				console.error("Failed to fetch users:", err);
				setError(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div className='home'>
			<h1>{t("home.title")}</h1>

			{loading && <p>Loading users...</p>}
			{error && <p>Error: {error}</p>}

			{!loading && !error && (
				<div>
					<h2>Users ({users.length})</h2>
					<ul>
						{users.map((user) => (
							<li key={user.id}>{user.pseudo || user.email}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
