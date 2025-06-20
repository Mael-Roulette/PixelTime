import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Home() {
	const { t } = useTranslation();

	const cards = [
		{ id: 1, name: "Tetris", image: "tetris.png" },
		{ id: 2, name: "PacMan", image: "pacman.png" },
		{ id: 3, name: "Snake", image: "snake.png" },
	];

	const keyNumbers = [
		{ id: 1, number: "1", text: t("home.originalTheme") },
		{ id: 2, number: "3", text: t("home.gameModes") },
		{ id: 3, number: "+50", text: t("home.iconicGames") },
	];

	return (
		<>
			<Header />

			<main className='home'>
				<section className='home-banner'>
					<div className='home-banner-content'>
						<div className='home-banner-content-text'>
							<h1 className='home-banner-content-title'>{t("home.title")}</h1>
							<p className='home-banner-content-description'>
								{t("home.description")}
							</p>
						</div>
						<div className='home-banner-content-buttons'>
							<div className='home-banner-content-buttons-auth'>
								<NavLink to={"/login"} className='button-primary'>
									{t("global.login")}
								</NavLink>
								<NavLink to={"/signin"} className='button-secondary'>
									{t("global.signup")}
								</NavLink>
							</div>
							<NavLink to={"/gamechoice"}>{t("home.guest")}</NavLink>
						</div>
					</div>
					<div className='home-banner-cards'>
						<ul className='home-banner-cards-list'>
							{cards.map((card) => {
								return (
									<li
										key={card.id}
										className='home-banner-cards-list-item'
										style={{ backgroundImage: `url(/cards/${card.image})` }}
									>
										<p>{card.name}</p>
									</li>
								);
							})}
						</ul>
					</div>
				</section>

				<section className='home-key-number'>
					<ul className='home-key-number-list'>
						{keyNumbers.map((keyNumber) => {
							return (
								<li className='home-key-number-list-item' key={keyNumber.id}>
									<p className='home-key-number-list-item-number'>
										{keyNumber.number}
									</p>
									<p className='home-key-number-list-item-text'>
										{keyNumber.text}
									</p>
								</li>
							);
						})}
					</ul>
				</section>

				<section className='home-explication'>
					<div className='home-explication-image'></div>
					<div className='home-explication-content'>
						<h2>{t("home.howItWorks")}</h2>
						<p
							className='home-explication-content-text'
							dangerouslySetInnerHTML={{
								__html: t("home.howItWorksDescription"),
							}}
						></p>

						<div className='home-explication-buttons'>
							<div className='home-explication-buttons-auth'>
								<NavLink to={"/login"} className='button-primary'>
									{t("global.login")}
								</NavLink>
								<NavLink to={"/signin"} className='button-secondary'>
									{t("global.signup")}
								</NavLink>
							</div>
							<NavLink to={"/gamechoice"}>{t("home.guest")}</NavLink>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
}
