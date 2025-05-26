import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

export default function BottomNavBar() {
	const { t } = useTranslation();

	const navItems = [
		{ to: "/choix-mode-jeu", label: t("global.play") },
		{ to: "/catalogue", label: t("global.catalog") },
		{ to: "/plateau-jeu", label: t("global.play") },
		{ to: "/classement", label: t("global.leaderboard") },
		{ to: "/profil", label: t("global.profile") },
	];

	return (
		<header className='bottom-nav-bar'>
			<nav>
				<ul>
					{navItems.map((item) => (
						<li key={item.to}>
							<NavLink to={item.to}>{item.label}</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
}
