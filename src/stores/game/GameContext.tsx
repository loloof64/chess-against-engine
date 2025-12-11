import { Chess, Color, Move } from "chess.js";
import { createContext, useContext, useReducer } from "react";
import generateKey from "../../utils/KeyGenerator";
import { MoveHistoryNodeProps } from "../../components/move_history/MoveHistoryNode";
import { Arrow } from "react-chessboard";

export enum GameActionType {
  startNewDefaultGame,
  startNewGame,
  makeMove,
  appendHistoryMove,
  stopGame,
  gotoPosition,
}

interface GameAction {
  type: GameActionType;
  value?: any;
}

interface Game {
  boardKey: string;
  positionFen: string;
  boardOrientation: Color;
  historyMoves: Array<MoveHistoryNodeProps>;
  inProgress: boolean;
  lastMoveArrow?: Arrow;
}

export interface HistoryUpdateProps {
  newFen: string;
  moveArrow: Arrow;
}

const GameContext = createContext<Game>(null as any);
const GameDispatchContext = createContext<React.Dispatch<GameAction>>(
  null as any
);

export const EMPTY_POSITION = "4k3/8/8/8/8/8/8/4K3 w - - 0 1";
export const DEFAULT_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const initialGame: Game = {
  boardKey: generateKey(),
  positionFen: EMPTY_POSITION,
  boardOrientation: "w",
  historyMoves: [],
  inProgress: false,
  lastMoveArrow: undefined,
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

function gameReducer(game: Game, action: GameAction): Game {
  switch (action.type) {
    case GameActionType.startNewDefaultGame:
      return {
        boardKey: generateKey(),
        positionFen: DEFAULT_POSITION,
        boardOrientation: "w",
        historyMoves: [],
        inProgress: true,
        lastMoveArrow: undefined,
      };
    case GameActionType.startNewGame:
      const newPosition = action.value;
      const newOrientation = newPosition.split(" ")[1] === "b" ? "b" : "w";
      return {
        boardKey: generateKey(),
        positionFen: newPosition,
        boardOrientation: newOrientation,
        historyMoves: [],
        inProgress: true,
        lastMoveArrow: undefined,
      };
    case GameActionType.makeMove:
      const gameLogic = new Chess(game.positionFen);
      const moveToDo: Move = action.value;
      gameLogic.move(moveToDo);
      const arrow = {
        startSquare: moveToDo.from,
        endSquare: moveToDo.to,
        color: "red",
      };
      return {
        ...game,
        boardKey: generateKey(),
        positionFen: gameLogic.fen(),
        lastMoveArrow: arrow,
      };
    case GameActionType.appendHistoryMove:
      const move = action.value;
      return {
        ...game,
        boardKey: generateKey(),
        historyMoves: [...game.historyMoves, move],
      };
    case GameActionType.stopGame:
      return {
        ...game,
        inProgress: false,
      };
    case GameActionType.gotoPosition:
      if (game.inProgress) return game;
      return {
        ...game,
        boardKey: generateKey(),
        positionFen: action.value.newFen,
        lastMoveArrow: action.value.moveArrow,
      };
    default:
      throw Error("Unknown action: " + action.type);
  }
}
