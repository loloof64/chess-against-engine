import { GameActionType, useGameDispatch } from "../stores/game/GameContext";

const NO_INTERVAL_HANDLER = -1;

// Shared state across all hook instances
const handlers = {
  white: NO_INTERVAL_HANDLER,
  black: NO_INTERVAL_HANDLER,
};
let lastSide: "white" | "black" = "white";
let currentDispatch: any = null;

export default function useClockHook() {
  const dispatch = useGameDispatch();
  currentDispatch = dispatch;

  function startClock(isWhiteTurn: boolean) {
    clearInterval(handlers.white);
    clearInterval(handlers.black);
    lastSide = isWhiteTurn ? "white" : "black";
    handlers.white = isWhiteTurn
      ? setInterval(() => {
          currentDispatch({
            type: GameActionType.tickWhiteClock,
          });
        }, 100)
      : NO_INTERVAL_HANDLER;
    handlers.black = isWhiteTurn
      ? NO_INTERVAL_HANDLER
      : setInterval(() => {
          currentDispatch({
            type: GameActionType.tickBlackClock,
          });
        }, 100);
  }

  function toggleClock() {
    // Always clear both first
    clearInterval(handlers.white);
    clearInterval(handlers.black);

    if (lastSide === "white") {
      handlers.black = setInterval(() => {
        currentDispatch({
          type: GameActionType.tickBlackClock,
        });
      }, 100);
      handlers.white = NO_INTERVAL_HANDLER;
      lastSide = "black";
    } else {
      handlers.white = setInterval(() => {
        currentDispatch({
          type: GameActionType.tickWhiteClock,
        });
      }, 100);
      handlers.black = NO_INTERVAL_HANDLER;
      lastSide = "white";
    }
  }

  function stopClock() {
    clearInterval(handlers.white);
    clearInterval(handlers.black);
    handlers.white = NO_INTERVAL_HANDLER;
    handlers.black = NO_INTERVAL_HANDLER;
  }

  return {
    startClock,
    toggleClock,
    stopClock,
  };
}
