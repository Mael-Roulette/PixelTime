import { observer } from "mobx-react-lite";
import { useGameStore } from "../../stores/useStore";
import ZoneDroppable from "./ZoneDroppable";
import Card from "./Card";
import Notification from "./Notification";


const GameTimeline = observer(() => {
	const gameStore = useGameStore();

	const handleDrop = (item, position) => {
		const dropResult = gameStore.dropCard(item.card, position);
	};

	return (
		<div className='game-timeline'>
			<Notification
				notification={gameStore.notification}
				onClose={() => gameStore.hideNotification()}
			/>

			{gameStore.placedCards.length === 0 ? (
				// Zone pour la première carte
				<div className='game-timeline-start'>
					<ZoneDroppable
						index={0}
						onDrop={handleDrop}
						cardDrop={null}
						isTimeline={true}
					/>
				</div>
			) : (
				// Timeline avec toutes les positions
				<div className='game-timeline-track'>
					{/* Position avant la première carte */}
					<ZoneDroppable
						index={0}
						onDrop={handleDrop}
						cardDrop={null}
						isTimeline={true}
					/>

					{gameStore.placedCards.map((card, cardIndex) => (
						<div key={card.id} className='game-timeline-segment'>
							{/* Carte */}
							<div className='game-timeline-card'>
								<Card
									card={card}
									isPlaced={true}
									result={gameStore.getCardResult(card.id)}
								/>
							</div>

							{/* Zone de drop après cette carte */}
							<ZoneDroppable
								index={cardIndex + 1}
								onDrop={handleDrop}
								cardDrop={null}
								isTimeline={true}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
});

export default GameTimeline;
