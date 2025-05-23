import { useState } from "react";
import { NavLink } from "react-router";

export default function Header() {
	const navItems = [
		{ to: "/choix-mode-jeu", label: "Jouer" },
		{ to: "/classement", label: "Classement" },
		{ to: "/connexion", label: "Connexion" },
	];

  const [isNavVisible, setIsNavVisible] = useState(false)

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  }

	return (
		<header className='header'>
			<NavLink to={"/"} className='header-logo'>
				<img src='/logo.png' alt='PixelTime' />
			</NavLink>
			<nav className={`header-nav ${ isNavVisible ? "active" : ""}`}>
				<ul>
					{navItems.map((item) => (
						<li key={item.to}>
							<NavLink to={item.to}>{item.label}</NavLink>
						</li>
					))}
				</ul>
			</nav>
			<button onClick={toggleNav} className={`header-toggle ${ isNavVisible ? "opened" : ""}`}>
				<span className='header-toggle-bars'></span>
				<span className='screen-reader-text'>Menu</span>
			</button>
		</header>
	);
}
