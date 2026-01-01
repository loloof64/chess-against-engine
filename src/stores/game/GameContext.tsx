import { Chess, Move, Square } from "chess.js";
import { createContext, useContext, useReducer } from "react";
import generateKey from "../../utils/KeyGenerator";
import { MoveHistoryNodeProps } from "../../components/move_history/MoveHistoryNode";
import { Arrow } from "react-chessboard";
import { convertTimeToDeciseconds } from "../../utils/Time";

export enum GameActionType {
  startNewGame,
  makeMove,
  appendHistoryMove,
  stopGame,
  gotoPositionIndex,
  setHistoryIndex,
  reverseBoard,
  startDragAndDrop,
  cancelDragAndDrop,
  tickWhiteClock,
  tickBlackClock,
  incrementWhiteClock,
  incrementBlackClock,
}

type BoardOrientation = "white" | "black" | undefined;

interface GameAction {
  type: GameActionType;
  value?: any;
}

interface Game {
  boardKey: string;
  positionFen: string;
  firstPosition: string;
  dragAndDropPositionFen?: string;
  boardOrientation: BoardOrientation;
  historyMoves: Array<MoveHistoryNodeProps>;
  inProgress: boolean;
  lastMoveArrow?: Arrow;
  historyIndex: number | undefined;
  computerHasWhite: boolean;
  useClock: boolean;
  whiteTimeDeciseconds: number;
  blackTimeDeciseconds: number;
  whiteIncrementSeconds: number;
  blackIncrementSeconds: number;
  whiteLossOnTime: boolean;
  blackLossOnTime: boolean;
  startWhiteTimeDeciseconds: number;
  startBlackTimeDeciseconds: number;
}

export const EMPTY_POSITION = "4k3/8/8/8/8/8/8/4K3 w - - 0 1";
export const DEFAULT_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const initialGame: Game = {
  boardKey: generateKey(),
  positionFen: EMPTY_POSITION,
  firstPosition: EMPTY_POSITION,
  dragAndDropPositionFen: undefined,
  boardOrientation: "white",
  historyMoves: [],
  inProgress: false,
  lastMoveArrow: undefined,
  historyIndex: undefined,
  computerHasWhite: true,
  useClock: false,
  whiteTimeDeciseconds: 300,
  blackTimeDeciseconds: 300,
  whiteIncrementSeconds: 0,
  blackIncrementSeconds: 0,
  whiteLossOnTime: false,
  blackLossOnTime: false,
  startWhiteTimeDeciseconds: 300,
  startBlackTimeDeciseconds: 300,
};

const GameContext = createContext<Game>(initialGame);
const GameDispatchContext = createContext<React.Dispatch<GameAction>>(
  null as any
);

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
    case GameActionType.startNewGame:
      const {
        newPosition,
        computerHasWhite,
        useClock,
        whiteTimeHours,
        whiteTimeMinutes,
        whiteTimeSeconds,
        whiteIncrementSeconds,
        blackTimeHours,
        blackTimeMinutes,
        blackTimeSeconds,
        blackIncrementSeconds,
      } = action.value;
      const newOrientation = computerHasWhite ? "black" : "white";
      const whiteTimeDeciseconds = convertTimeToDeciseconds({
        hours: whiteTimeHours,
        minutes: whiteTimeMinutes,
        seconds: whiteTimeSeconds,
      });
      const blackTimeDeciseconds = convertTimeToDeciseconds({
        hours: blackTimeHours,
        minutes: blackTimeMinutes,
        seconds: blackTimeSeconds,
      });

      return {
        boardKey: generateKey(),
        positionFen: newPosition,
        firstPosition: newPosition,
        dragAndDropPositionFen: undefined,
        boardOrientation: newOrientation,
        historyMoves: [],
        inProgress: true,
        lastMoveArrow: undefined,
        historyIndex: undefined,
        computerHasWhite,
        useClock,
        whiteTimeDeciseconds,
        blackTimeDeciseconds,
        whiteIncrementSeconds,
        blackIncrementSeconds,
        whiteLossOnTime: false,
        blackLossOnTime: false,
        startWhiteTimeDeciseconds: whiteTimeDeciseconds,
        startBlackTimeDeciseconds: blackTimeDeciseconds,
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
        dragAndDropPositionFen: undefined,
        lastMoveArrow: arrow,
      };
    case GameActionType.appendHistoryMove:
      const move = action.value;
      return {
        ...game,
        boardKey: generateKey(),
        historyMoves: [...game.historyMoves, move],
        historyIndex: (game.historyIndex ?? -1) + 1,
      };
    case GameActionType.stopGame:
      return {
        ...game,
        inProgress: false,
      };
    case GameActionType.gotoPositionIndex:
      if (game.inProgress) return game;

      const index: number = action.value;

      let newFen: string;
      let moveArrow: Arrow | undefined;

      let newWhiteTimeDeciseconds: number;
      let newBlackTimeDeciseconds: number;

      if (index < 1) {
        newFen = game.firstPosition;
        moveArrow = undefined;
        newWhiteTimeDeciseconds = game.startWhiteTimeDeciseconds;
        newBlackTimeDeciseconds = game.startBlackTimeDeciseconds;
      } else {
        newFen = game.historyMoves[index].fen;
        moveArrow = game.historyMoves[index].moveArrow;
        newWhiteTimeDeciseconds = game.historyMoves[index].whiteTimeDeciseconds;
        newBlackTimeDeciseconds = game.historyMoves[index].blackTimeDeciseconds;
      }

      return {
        ...game,
        boardKey: generateKey(),
        positionFen: newFen,
        dragAndDropPositionFen: undefined,
        lastMoveArrow: moveArrow,
        historyIndex: index,
        whiteTimeDeciseconds: newWhiteTimeDeciseconds,
        blackTimeDeciseconds: newBlackTimeDeciseconds,
      };
    case GameActionType.setHistoryIndex:
      if (game.inProgress) return game;
      return {
        ...game,
        boardKey: generateKey(),
        historyIndex: action.value,
      };
    case GameActionType.reverseBoard: {
      return {
        ...game,
        boardKey: generateKey(),
        boardOrientation: game.boardOrientation === "black" ? "white" : "black",
      };
    }
    case GameActionType.startDragAndDrop: {
      const square = action.value as Square;
      const gameLogic = new Chess(game.positionFen, { skipValidation: true });
      gameLogic.remove(square);
      const newPosition = gameLogic.fen();

      return {
        ...game,
        dragAndDropPositionFen: newPosition,
        boardKey: generateKey(),
      };
    }
    case GameActionType.cancelDragAndDrop: {
      return {
        ...game,
        dragAndDropPositionFen: undefined,
        boardKey: generateKey(),
      };
    }
    case GameActionType.tickWhiteClock: {
      const newDeciseconds = game.whiteTimeDeciseconds - 1;
      if (newDeciseconds <= 0) {
        return {
          ...game,
          inProgress: false,
          whiteTimeDeciseconds: 0,
          whiteLossOnTime: true,
        };
      } else {
        return {
          ...game,
          whiteTimeDeciseconds: newDeciseconds,
        };
      }
    }
    case GameActionType.tickBlackClock: {
      const newDeciseconds = game.blackTimeDeciseconds - 1;
      if (newDeciseconds <= 0) {
        return {
          ...game,
          inProgress: false,
          blackTimeDeciseconds: 0,
          blackLossOnTime: true,
        };
      } else {
        return {
          ...game,
          blackTimeDeciseconds: newDeciseconds,
        };
      }
    }
    case GameActionType.incrementWhiteClock: {
      return {
        ...game,
        whiteTimeDeciseconds:
          game.whiteTimeDeciseconds + game.whiteIncrementSeconds * 10,
      };
    }
    case GameActionType.incrementBlackClock: {
      return {
        ...game,
        blackTimeDeciseconds:
          game.blackTimeDeciseconds + game.blackIncrementSeconds * 10,
      };
    }
    default:
      throw Error("Unknown action: " + action.type);
  }
}
