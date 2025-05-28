import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

export default function Header() {
	const { t, i18n } = useTranslation();

	const navItems = [
		{ to: "/gamechoice", label: t("global.play") },
		{ to: "/leaderboard", label: t("global.leaderboard") },
		{ to: "/login", label: t("global.login") },
	];

	const [isNavVisible, setIsNavVisible] = useState(false);

	const toggleNav = () => {
		setIsNavVisible(!isNavVisible);
	};

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
	};

	return (
		<header className='header'>
			<NavLink to={"/"} className='header-logo'>
				<img src='/pixeltime.png' alt='PixelTime' />
			</NavLink>
			<nav className={`header-nav ${isNavVisible ? "active" : ""}`}>
				<ul>
					{navItems.map((item) => (
						<li key={item.to}>
							<NavLink to={item.to}>{item.label}</NavLink>
						</li>
					))}
				</ul>
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
			</nav>
			<button
				onClick={toggleNav}
				className={`header-toggle ${isNavVisible ? "opened" : ""}`}
			>
				<span className='header-toggle-bars'></span>
				<span className='screen-reader-text'>Menu</span>
			</button>
		</header>
	);
}
