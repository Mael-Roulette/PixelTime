import { useTranslation } from "react-i18next";

const Icons = {
	GameMode: () => (""),
	Catalog: () => (""),
	Play: () => (""),
	LeaderBoard: () => (""),
	Profile: () => (""),
};

function BottomNavigation({
	activeItem,
	onItemClick = () => {},
	className = "",
}) {
  const { t } = useTranslation();

  const items = [
	{ id: "gameMode", label: t("global.gameModes"), icon: "GameMode" },
	{ id: "catalog", label: t("global.catalog"), icon: "Catalog" },
	{ id: "play", label: t("global.play"), icon: "Play", isCenter: true },
	{ id: "leaderboard", label: t("global.leaderboard"), icon: "LeaderBoard" },
	{ id: "profile", label: t("global.profile"), icon: "Profile" },
  ];
	const handleItemClick = (item) => {
		onItemClick(item);
	};

	return (
		<nav className={`bottom-navigation ${className}`}>
			<div className='bottom-navigation__container'>
				{items.map((item) => {
					const IconComponent = Icons[item.icon];
					const isActive = activeItem === item.id;

					return (
						<button
							key={item.id}
							className={`
                bottom-navigation__item
                ${isActive ? "bottom-navigation__item--active" : ""}
                ${item.isCenter ? "bottom-navigation__item--center" : ""}
              `}
							onClick={() => handleItemClick(item)}
						>
							<div className='bottom-navigation__icon'>
								{IconComponent && <IconComponent />}
							</div>
							{item.label && (
								<span className='bottom-navigation__label'>{item.label}</span>
							)}
						</button>
					);
				})}
			</div>
		</nav>
	);
}

export default BottomNavigation;