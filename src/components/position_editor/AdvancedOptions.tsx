import { t } from "i18next";
import "./AdvancedOptions.css";
import {
  PositionEditorActionType,
  usePositionEditor,
  usePositionEditorDispatch,
} from "../../stores/game/PositionEditorContext";
import { Chess, Color } from "chess.js";

function AdvancedOptions() {
  const { currentPosition } = usePositionEditor();
  const dispatch = usePositionEditorDispatch();

  function handleChangeTurn(newColor: Color) {
    let gameLogic = new Chess(currentPosition);
    gameLogic.setTurn(newColor);
    dispatch({
      type: PositionEditorActionType.changeCurrentPosition,
      value: gameLogic.fen(),
    });
  }

  function handleCastleChange(type: string, isToBeAdded: boolean) {
    let positionParts = currentPosition.split(" ");
    let castlePart = positionParts[2];
    if (isToBeAdded) {
      if (!castlePart.includes(type)) {
        castlePart += type;
        castlePart = adaptCastles(castlePart);
      }
    } else {
      if (castlePart.includes(type)) {
        castlePart = castlePart
          .split("")
          .filter((e) => e !== type)
          .join("");
        castlePart = adaptCastles(castlePart);
      }
    }
    positionParts[2] = castlePart;
    const newPosition = positionParts.join(" ");
    try {
      new Chess(newPosition); // check validity
      dispatch({
        type: PositionEditorActionType.changeCurrentPosition,
        value: newPosition,
      });
    } catch (err) {
      console.error(err);
    }
    //TODO check for validity
  }

  function handleEnPassantFileChange(value: string) {
    let positionParts = currentPosition.split(" ");
    const whiteTurn = currentPosition.split(" ")[1] === "w";
    const rank = whiteTurn ? "6" : "3";
    const enPassant = value === "-" ? value : `${value}${rank}`;
    positionParts[3] = enPassant;
    const newPosition = positionParts.join(" ");
    try {
      new Chess(newPosition); // check validity
      dispatch({
        type: PositionEditorActionType.changeCurrentPosition,
        value: newPosition,
      });
    } catch (err) {
      console.error(err);
    }
    //TODO check for validity
  }

  function handleDrawHalfMovesCountChange(newValue: string) {
    const newValueAsNum = parseInt(newValue);
    if (isNaN(newValueAsNum) || newValueAsNum < 0) {
      console.error("Invalid number for half moves count");
      return;
    }

    let positionParts = currentPosition.split(" ");
    positionParts[4] = newValueAsNum.toString();
    const newPosition = positionParts.join(" ");

    dispatch({
      type: PositionEditorActionType.changeCurrentPosition,
      value: newPosition,
    });
  }

  function handleMoveNumberChange(newValue: string) {
    const newValueAsNum = parseInt(newValue);
    if (isNaN(newValueAsNum) || newValueAsNum < 1) {
      console.error("Invalid move number");
      return;
    }

    let positionParts = currentPosition.split(" ");
    positionParts[5] = newValueAsNum.toString();
    const newPosition = positionParts.join(" ");

    dispatch({
      type: PositionEditorActionType.changeCurrentPosition,
      value: newPosition,
    });
  }

  function adaptCastles(value: string): string {
    /*
    Filter and order letters :
    1) should be letters "K"
    2) should be letters "Q"
    3) should be letters "k"
    4) should be letters "q"

    Then if result is empty, return "-"
    otherwise the result
    */

    const allowed = ["K", "Q", "k", "q"];
    let filtered = value
      .split("")
      .filter((c) => allowed.includes(c))
      .filter((c, i, arr) => arr.indexOf(c) === i); // remove duplicates

    let ordered = ["K", "Q", "k", "q"]
      .filter((c) => filtered.includes(c))
      .join("");
    return ordered.length === 0 ? "-" : ordered;
  }

  function getCurrentTurn(): Color {
    return currentPosition.split(" ")[1] as Color;
  }

  function getCurrentCastles(): Array<string> {
    //TODO check for validity
    return currentPosition.split(" ")[2].split("");
  }

  function getCurrentEnPassant(): string {
    //TODO check for validity
    const enPassantPart = currentPosition.split(" ")[3];
    return enPassantPart === "-" ? enPassantPart : enPassantPart.charAt(0);
  }

  function getCurrentDrawHalfMovesCount(): string {
    return currentPosition.split(" ")[4];
  }

  function getCurrentMoveNumber(): string {
    return currentPosition.split(" ")[5];
  }

  return (
    <div className="advancedOptions">
      <div className="field">
        <label>{t("dialogs.positionEditor.advanced.turn.label")}</label>
        <div className="radioOption">
          <input
            type="radio"
            name="turn"
            value="whiteTurn"
            id="whiteTurn"
            onChange={() => handleChangeTurn("w")}
            checked={getCurrentTurn() === "w"}
          />
          <label htmlFor="whiteTurn">
            {t("dialogs.positionEditor.advanced.turn.white")}
          </label>
        </div>
        <div className="radioOption">
          <input
            type="radio"
            name="turn"
            value="blackTurn"
            id="blackTurn"
            onChange={() => handleChangeTurn("b")}
            checked={getCurrentTurn() === "b"}
          />
          <label htmlFor="blackTurn">
            {t("dialogs.positionEditor.advanced.turn.black")}
          </label>
        </div>
      </div>
      <div className="field">
        <label>{t("dialogs.positionEditor.advanced.castles.label")}</label>
        <div className="checkboxOption">
          <input
            type="checkbox"
            name="castleWhiteOO"
            id="castleWhiteOO"
            onChange={(e) => {
              const isChecked = e.target.checked;
              handleCastleChange("K", isChecked);
            }}
            checked={getCurrentCastles().includes("K")}
          />
          <label htmlFor="castleWhiteOO">
            {t("dialogs.positionEditor.advanced.castles.whiteOO")}
          </label>
        </div>
        <div className="checkboxOption">
          <input
            type="checkbox"
            name="castleWhiteOOO"
            id="castleWhiteOOO"
            onChange={(e) => {
              const isChecked = e.target.checked;
              handleCastleChange("Q", isChecked);
            }}
            checked={getCurrentCastles().includes("Q")}
          />
          <label htmlFor="castleWhiteOOO">
            {t("dialogs.positionEditor.advanced.castles.whiteOOO")}
          </label>
        </div>
        <div className="checkboxOption">
          <input
            type="checkbox"
            name="castleBlackOO"
            id="castleBlackOO"
            onChange={(e) => {
              const isChecked = e.target.checked;
              handleCastleChange("k", isChecked);
            }}
            checked={getCurrentCastles().includes("k")}
          />
          <label htmlFor="castleBlackOO">
            {t("dialogs.positionEditor.advanced.castles.blackOO")}
          </label>
        </div>
        <div className="checkboxOption">
          <input
            type="checkbox"
            name="castleBlackOOO"
            id="castleBlackOOO"
            onChange={(e) => {
              const isChecked = e.target.checked;
              handleCastleChange("q", isChecked);
            }}
            checked={getCurrentCastles().includes("q")}
          />
          <label htmlFor="castleBlackOOO">
            {t("dialogs.positionEditor.advanced.castles.blackOOO")}
          </label>
        </div>
      </div>

      <div className="field">
        <label htmlFor="enPassantFile">
          {t("dialogs.positionEditor.advanced.enPassantFile")}
        </label>
        <select
          name="enPassantFile"
          className="enPassantFile"
          onChange={(e) => handleEnPassantFileChange(e.target.value)}
          defaultValue={getCurrentEnPassant()}
        >
          <option value="-">-</option>
          <option value="a">a</option>
          <option value="b">b</option>
          <option value="c">c</option>
          <option value="d">d</option>
          <option value="e">e</option>
          <option value="f">f</option>
          <option value="g">g</option>
          <option value="h">h</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="drawHalfMovesCount">
          {t("dialogs.positionEditor.advanced.drawHalfMovesCount")}
        </label>
        <input
          type="number"
          name="drawHalfMovesCount"
          onChange={(e) => handleDrawHalfMovesCountChange(e.target.value)}
          value={getCurrentDrawHalfMovesCount()}
        />
      </div>

      <div className="field">
        <label htmlFor="moveNumber">
          {t("dialogs.positionEditor.advanced.moveNumber")}
        </label>
        <input
          type="number"
          name="moveNumber"
          onChange={(e) => handleMoveNumberChange(e.target.value)}
          value={getCurrentMoveNumber()}
        />
      </div>
    </div>
  );
}

export default AdvancedOptions;
