import { use } from "react";
import { PixeltimeContext } from "./pixeltimeContext";

export const usePixeltimeStore = () => {
  const pixeltimeStore = use( PixeltimeContext );
  if ( !pixeltimeStore ) {
    throw new Error( "useExponiaStore must be used within an ExponiaProvider" );
  }
  return pixeltimeStore;
}

export const useAppStore = () => {
  const pixeltimeStore = usePixeltimeStore();
  return pixeltimeStore.appStore;
}