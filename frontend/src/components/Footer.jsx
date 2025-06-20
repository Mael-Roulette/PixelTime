import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import authService from "../../services/authService";

const Footer = () => {
	const { t, i18n } = useTranslation();
	const isAuthenticated = authService.isAuthenticated();

	const navItems = [
		{ name: t("footer.home"), path: "/" },
		isAuthenticated
			? { name: t("global.profile"), path: "/profile" }
			: { name: t("global.login"), path: "/login" },
		{ name: t("global.leaderboard"), path: "/leaderboard" },
	];

	const contactItems = [
		{ name: "Floriane Louis", site: "https://floriane-louis.fr" },
		{ name: "Maël Roulette", site: "https://mael-roulette.fr" },
		{ name: "IUT Laval", site: "https://iut-laval.univ-lemans.fr" },
	];

	const legalItems = [
		{ name: t("footer.legal"), path: "/mentions-legales" },
		{ name: t("footer.privacy"), path: "/politique-de-confidentialite" },
	];

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		localStorage.setItem("language", lng);
	};

	return (
		<footer className='footer'>
			<div className='footer-container'>
				<div className='footer-container-social'>
					<div className='footer-container-social-logo'>
						<img src='/pixeltime.png' alt='PixelTime' />
						<p>Pixeltime</p>
					</div>
					<p className='footer-container-social-tagline'>
						{t("footer.sloggan")}
					</p>
				</div>

				<div className='footer-container-navigation'>
					<h2>{t("footer.navigation")}</h2>
					<nav>
						<ul>
							{navItems.map((item, index) => (
								<li key={index}>
									<NavLink to={item.path}>{item.name}</NavLink>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className='footer-container-contact'>
					<h2>{t("footer.contact")}</h2>
					<ul>
						{contactItems.map((item, index) => (
							<li key={index}>
								<NavLink to={item.site} target='_blank'>
									{item.name}
								</NavLink>
							</li>
						))}
					</ul>
				</div>

				<div className='header-lang-switcher'>
					<select
						value={i18n.language}
						onChange={(e) => changeLanguage(e.target.value)}
						className='header-lang-select'
					>
						<option value='fr'>FR</option>
						<option value='en'>EN</option>
						<option value='es'>ES</option>
					</select>
				</div>
			</div>

			<div className='footer-legal'>
				<ul>
					{legalItems.map((item, index) => (
						<li key={index}>
							<NavLink to={item.path}>{item.name}</NavLink>
						</li>
					))}
				</ul>
			</div>
		</footer>
	);
};

export default Footer;
