const Card = ({ card }) => {
	return (
		<div className='card' style={{backgroundImage: `url(/cards/${card.image})`}}>
			<div className='card-front'>
				<p className='card-year'>{card.year}</p>
				<p className='card-title'>{card.title}</p>
			</div>

			<div className='card-back'>
				<p></p>
			</div>
		</div>
	);
};

export default Card;
