import { useDrag } from "react-dnd";
import Card from "./Card";

const ZoneDraggable = ({ card }) => {
	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: "card",
			item: { card },
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
		}),
		[card]
	);

	return (
		<div
			className='draggable-zone'
			draggable='true'
			ref={drag}
			style={{
				zIndex: isDragging ? 1000 : 1,
				opacity: isDragging ? 0 : 1,
			}}
		>
			<Card card={card} draggable='false' isPlaced={false} />
		</div>
	);
};

export default ZoneDraggable;
