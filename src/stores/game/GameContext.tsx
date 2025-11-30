import { Color } from "chess.js";
import { createContext, useContext, useReducer } from "react";

export enum GameActionType {
  startNewDefaultGame,
  startNewGame,
}

interface GameAction {
  type: GameActionType;
  value?: any;
}

interface Game {
  positionFen: string;
  boardOrientation: Color;
}

const GameContext = createContext<Game>(null as any);
const GameDispatchContext = createContext<React.Dispatch<GameAction>>(
  null as any
);

export const EMPTY_POSITION = "4k3/8/8/8/8/8/8/4K3 w - - 0 1";
export const DEFAULT_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const initialGame: Game = {
  positionFen: EMPTY_POSITION,
  boardOrientation: "w",
};

export function useGame() {
  return useContext(GameContext);
}

export function useGameDispatch() {
  return useContext(GameDispatchContext);
}

export default function GameProvider({ children }: any) {
  const [game, dispatch] = useReducer(gameReducer, initialGame);

  return (
    <GameContext.Provider value={game}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
}

function gameReducer(_game: Game, action: GameAction): Game {
  switch (action.type) {
    case GameActionType.startNewDefaultGame:
      return {
        positionFen: DEFAULT_POSITION,
        boardOrientation: "w",
      };
    case GameActionType.startNewGame:
      const newPosition = action.value;
      const newOrientation = newPosition.split(" ")[1] === "b" ? "b" : "w";
      return {
        positionFen: newPosition,
        boardOrientation: newOrientation,
      };
    default:
      throw Error("Unknown action: " + action.type);
  }
}
