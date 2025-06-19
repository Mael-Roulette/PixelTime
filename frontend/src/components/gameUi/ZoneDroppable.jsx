import { useDrop } from "react-dnd";

const ZoneDroppable = ({ index, cardDrop, onDrop }) => {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: "card",
		canDrop: () => !cardDrop,
		drop: (item) => {
			onDrop(item, index);
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	}));

  return (
    <div
      className={`droppable-zone ${isOver ? "drag-over" : ""}`}
      ref={drop}
    ></div>
  );
};

export default ZoneDroppable;
