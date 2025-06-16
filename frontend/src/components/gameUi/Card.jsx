const Card = ({ title, image, year, description, hint }) => {
	return (
		<div className='card' style={{backgroundImage: `url(/cards/${image})`}}>
			<div className='card-front'>
				<div className='card-image'>
					<img src={image} alt={title} />
				</div>
				<p className='card-year'>{year}</p>
				<p className='card-title'>{title}</p>
			</div>

			<div className='card-back'>
				<p></p>
			</div>
		</div>
	);
};

export default Card;
