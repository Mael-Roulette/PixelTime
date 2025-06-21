const Card = ({ card, isPlaced, result, isCatalog = false }) => {
    if (isCatalog) {
        // Version pour le catalogue avec flip
        return (
            <>
                <div className='flip-card-front' style={{ backgroundImage: `url(/cards/${card.image})` }}>
                    <div className='card-front'>
                        <p className='card-year'>{card.year}</p>
                        <p className='card-title'>{card.title}</p>
                    </div>
                </div>
                <div className='flip-card-back'>
                    <div className='card-back'>
                        <p className="card-description">{card.description}</p>
                    </div>
                </div>
            </>
        );
    }

    // Version normale pour le jeu
    return (
        <div className={`card ${isPlaced && result ? "correct" : ""} ${isPlaced && !result ? "incorrect" : ""}`}
            style={{ backgroundImage: `url(/cards/${card.image})` }}>
            <div className='card-front'>
                {isPlaced && <p className='card-year'>{card.year}</p>}
                <p className='card-title'>{card.title}</p>
            </div>
        </div>
    );
};

export default Card;