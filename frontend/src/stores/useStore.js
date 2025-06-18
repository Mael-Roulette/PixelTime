import { use } from "react";
import { PixeltimeContext } from "./pixeltimeContext";

export const usePixeltimeStore = () => {
  const pixeltimeStore = use( PixeltimeContext );
  if ( !pixeltimeStore ) {
    throw new Error( "usePixeltimeStore must be used within an pixeltimeProvider" );
  }
  return pixeltimeStore;
}

export const useLeaderboardStore = () => {
  const pixeltimeStore = usePixeltimeStore();
  return pixeltimeStore.leaderboardStore;
}

export const useGameStore = () => {
  const pixeltimeStore = usePixeltimeStore();
  return pixeltimeStore.gameStore;
};