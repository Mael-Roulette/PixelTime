const Card = ({ title, image, date, description, hint }) => {
	return (
		<div className='card'>
      <div className="card-front">
        <div className='card-image'>
          <img src={image} alt={title} />
        </div>
        <p className='card-title'>{title}</p>
      </div>

      <div className="card-back">
        <p></p>
      </div>
		</div>
	);
};

export default Card;
