import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { api } from "./services/api";
import { useTranslation } from "react-i18next";

function App() {
	const [count, setCount] = useState(0);
	const [apiMessage, setApiMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const testApiConnection = async () => {
		setLoading(true);
		try {
			const data = await api.get("/ping");
			setApiMessage(data.message);
		} catch (error) {
			setApiMessage(`Error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const { t, i18n } = useTranslation();

	return (
		<>
			<div>
				<a href='https://vite.dev' target='_blank'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank'>
					<img src={reactLogo} className='logo react' alt='React logo' />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className='card'>
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>

				<div>
					<button onClick={testApiConnection} disabled={loading}>
						{loading ? "Testing..." : "Test API Connection"}
					</button>
					{apiMessage && <p>API response: {apiMessage}</p>}
				</div>
				<div>
					<p>{t("home.title")}</p>
					<button onClick={() => i18n.changeLanguage("fr")}>Français</button>
					<button onClick={() => i18n.changeLanguage("en")}>English</button>
					<button onClick={() => i18n.changeLanguage("es")}>Español</button>
				</div>
			</div>
			<p className='read-the-docs'>
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
