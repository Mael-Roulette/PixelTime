const Card = ({ card, isPlaced, result }) => {
	return (
		<div
			className={`card ${isPlaced && result ? "correct" : ""} ${isPlaced && !result ? "incorrect" : ""}`}
			style={{ backgroundImage: `url(/cards/${card.image})` }}
		>
			<div className='card-front'>
				{isPlaced && <p className='card-year'>{card.year}</p>}
				<p className='card-title'>{card.title}</p>
			</div>

			<div className='card-back'>
				<p></p>
			</div>
		</div>
	);
};

export default Card;
