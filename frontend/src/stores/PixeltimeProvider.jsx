import AppStore from "./appStore";
import { PixeltimeContext } from "./pixeltimeContext";

const appStore = new AppStore();

const pixeltimeStore = {
	appStore,
};

export const PixeltimeProvider = ({ children }) => {
	return <PixeltimeContext value={pixeltimeStore}>{children}</PixeltimeContext>;
};
