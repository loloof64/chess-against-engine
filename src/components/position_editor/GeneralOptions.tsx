import { t } from "i18next";
import ClockOptions from "./ClockOptions";
import ComputerOptions from "./ComputerOptions";
import "./GeneralOptions.css";
import { Chess, Color } from "chess.js";
import {
  PositionEditorActionType,
  usePositionEditor,
  usePositionEditorDispatch,
} from "../../stores/game/PositionEditorContext";

function GeneralOptions() {
  const { currentPosition } = usePositionEditor();
  const editorDispatch = usePositionEditorDispatch();

  function handleChangeTurn(newColor: Color) {
    try {
      /*
        If the king is currently in check, then swapping turn
        would lead to an illegal position.
      */
      const matchingGameLogic = new Chess(currentPosition);
      if (matchingGameLogic.inCheck()) return;

      let parts = currentPosition.split(" ");
      parts[1] = newColor;
      const newPosition = parts.join(" ");

      new Chess(newPosition); // check validity
      editorDispatch({
        type: PositionEditorActionType.changeCurrentPosition,
        value: newPosition,
      });
    } catch (e) {
      console.error(e);
    }
  }

  function getCurrentTurn(): Color {
    return currentPosition.split(" ")[1] as Color;
  }

  return (
    <div className="generalOptions">
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
      <ComputerOptions />
      <ClockOptions />
    </div>
  );
}

export default GeneralOptions;
