import {
  GameActionType,
  useGame,
  useGameDispatch,
} from "../stores/game/GameContext";
import { useRef, useEffect } from "react";

const NO_INTERVAL_HANDLER = -1;

// Shared state across all hook instances
const handlers = {
  white: NO_INTERVAL_HANDLER,
  black: NO_INTERVAL_HANDLER,
  isWhiteRunning: true,
};
let currentDispatch: any = null;
let currentUseClock = true;

export default function useClockHook() {
  const { useClock } = useGame();
  const dispatch = useGameDispatch();
  currentDispatch = dispatch;

  const useClockRef = useRef(useClock);

  useEffect(() => {
    useClockRef.current = useClock;
    currentUseClock = useClock;
    // Stop clocks when useClock becomes false
    if (!useClock) {
      clearInterval(handlers.white);
      clearInterval(handlers.black);
      handlers.white = NO_INTERVAL_HANDLER;
      handlers.black = NO_INTERVAL_HANDLER;
    }
  }, [useClock]);

  function startClock(isWhiteTurn: boolean, forceUseClock?: boolean) {
    const shouldUseClock = forceUseClock ?? useClockRef.current;
    if (!shouldUseClock) return;
    clearInterval(handlers.white);
    clearInterval(handlers.black);
    handlers.isWhiteRunning = isWhiteTurn;
    handlers.white = isWhiteTurn
      ? setInterval(() => {
          if (!currentUseClock) return;
          currentDispatch({
            type: GameActionType.tickWhiteClock,
          });
        }, 100)
      : NO_INTERVAL_HANDLER;
    handlers.black = isWhiteTurn
      ? NO_INTERVAL_HANDLER
      : setInterval(() => {
          if (!currentUseClock) return;
          currentDispatch({
            type: GameActionType.tickBlackClock,
          });
        }, 100);
  }

  function toggleClock() {
    if (!useClockRef.current) return;
    // Always clear both first
    clearInterval(handlers.white);
    clearInterval(handlers.black);

    if (handlers.isWhiteRunning) {
      handlers.white = NO_INTERVAL_HANDLER;
      currentDispatch({
        type: GameActionType.incrementWhiteClock,
      });
      handlers.black = setInterval(() => {
        if (!currentUseClock) return;
        currentDispatch({
          type: GameActionType.tickBlackClock,
        });
      }, 100);
      handlers.isWhiteRunning = false;
    } else {
      handlers.black = NO_INTERVAL_HANDLER;
      currentDispatch({
        type: GameActionType.incrementBlackClock,
      });
      handlers.white = setInterval(() => {
        if (!currentUseClock) return;
        currentDispatch({
          type: GameActionType.tickWhiteClock,
        });
      }, 100);
      handlers.isWhiteRunning = true;
    }
  }

  function stopClock() {
    // Always clear intervals regardless of useClock setting
    clearInterval(handlers.white);
    clearInterval(handlers.black);
    handlers.white = NO_INTERVAL_HANDLER;
    handlers.black = NO_INTERVAL_HANDLER;
  }

  return {
    startClock,
    toggleClock,
    stopClock,
    isWhiteRunning: handlers.isWhiteRunning,
  };
}
