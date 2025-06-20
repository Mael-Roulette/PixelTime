import { useState } from "react";
import { NavLink } from "react-router";

const CardMode = ({ title, description, type, image }) => {
	const [isReadingDescription, setIsReadingDescription] = useState(false);

	const handleDescriptionClick = () => {
		setIsReadingDescription(!isReadingDescription);
	};

	return (
		<div className='card-mode' style={{ backgroundImage: `url(${image})` }}>
			<div className='card-mode-header'>
				<h2 className='card-mode-header-title'>{title}</h2>
				<button
					className='card-mode-header-description'
					onClick={handleDescriptionClick}
					aria-label="Afficher la description du mode de jeu"
				>
					?
				</button>
			</div>

			<NavLink
				to={`/gameboard?type=${type}`}
				className='card-mode-link button-primary'
			>
				Jouer
			</NavLink>

			<div className={`card-mode-description ${isReadingDescription ? "active" : ""}`}>
				<p>{description}</p>
        <button
          className='card-mode-description-close'
          onClick={handleDescriptionClick}
					aria-label="Fermer la description"
        >X</button>
			</div>
		</div>
	);
};

export default CardMode;
