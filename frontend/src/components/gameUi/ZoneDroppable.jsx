import { useDrop } from "react-dnd";
import { observer } from "mobx-react-lite";
import Card from "./Card";

const ZoneDroppable = observer(
	({ index, onDrop, cardDrop, isTimeline, previewCard, showPreview }) => {
		const [{ isOver }, drop] = useDrop(() => ({
			accept: "card",
			drop: (item) => onDrop(item, index),
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
			}),
		}));

		return (
			<div
				ref={drop}
				className={`droppable-zone ${isOver ? "drag-over" : ""} ${
					isTimeline ? "timeline" : ""
				}`}
			>
				{/* Affichage de la prévisualisation si nécessaire */}
				{showPreview && previewCard && (
					<div className='preview-card'>
						<Card card={previewCard} isPlaced={false} result={null} />
					</div>
				)}

				{/* Affichage de la carte droppée si elle existe */}
				{cardDrop && <Card card={cardDrop} isPlaced={true} result={null} />}
			</div>
		);
	}
);

export default ZoneDroppable;
