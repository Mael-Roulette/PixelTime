import { observer } from "mobx-react-lite";
import { useGameStore } from "../../stores/useStore";
import ZoneDroppable from "./ZoneDroppable";
import Card from "./Card";
import Notification from "./Notification";

const GameTimeline = observer(({ previewPosition, previewCard }) => {
	const gameStore = useGameStore();

	const handleDrop = (item, position) => {
		gameStore.dropCard(item.card, position);
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
						previewCard={previewCard}
						showPreview={previewPosition === 0}
					/>
				</div>
			) : (
				// Timeline avec toutes les positions
				<div className='game-timeline-track'>
					{/* Zone de dépot avant la première carte */}
					<ZoneDroppable
						index={0}
						onDrop={handleDrop}
						cardDrop={null}
						isTimeline={true}
						previewCard={previewCard}
						showPreview={previewPosition === 0}
					/>

					{gameStore.placedCards.map((card, cardIndex) => (
						<div key={card.id} className='game-timeline-segment'>
							{/* Carte placée */}
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
								previewCard={previewCard}
								showPreview={previewPosition === cardIndex + 1}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
});

export default GameTimeline;
