import { ChessGame } from "@react-chess-tools/react-chess-game";
import MovesHistory from "../move_history/MovesHistory";
import "./Game.css";

function Game() {
  return (
    <>
      <div className="board">
        <ChessGame.Root>
          <ChessGame.Board />
        </ChessGame.Root>
      </div>
      <MovesHistory />
    </>
  );
}

export default Game;
