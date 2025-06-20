import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const Notification = observer(({ notification, onClose }) => {
	useEffect(() => {
		if (notification && notification.duration) {
			const timer = setTimeout(() => {
				onClose();
			}, notification.duration);

			return () => clearTimeout(timer);
		}
	}, [notification, onClose]);

	if (!notification) return null;

	const getIcon = (type) => {
		switch (type) {
			case "warning":
				return "⚠️";
			case "error":
				return "❌";
			case "success":
				return "✅";
			case "info":
			default:
				return "ℹ️";
		}
	};

	return (
		<div className={`notification`}>
			<div className={`notification-content notification-content-${notification.type}`}>
				<span className='notification-icon'>{getIcon(notification.type)}</span>
				<div className='notification-text'>
					<div className='notification-title'>{notification.title}</div>
					<div className='notification-message'>{notification.message}</div>
				</div>
				<button className='notification-close' onClick={onClose}>
					x
				</button>
			</div>
		</div>
	);
});

export default Notification;
