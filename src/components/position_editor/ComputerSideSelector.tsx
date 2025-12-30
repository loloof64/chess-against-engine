import { t } from "i18next";
import "./ComputerSideSelector.css";
import {
  PositionEditorActionType,
  usePositionEditor,
  usePositionEditorDispatch,
} from "../../stores/game/PositionEditorContext";

function ComputerSideSelector() {
  const dispatch = usePositionEditorDispatch();
  const { computerHasWhite } = usePositionEditor();

  function handleChangeComputerTempSide(hasWhiteSide: boolean) {
    dispatch({
      type: PositionEditorActionType.setComputerSide,
      value: hasWhiteSide,
    });
  }

  return (
    <div className="computerSideSelector">
      <label>
        {t("dialogs.positionEditor.computerSide.label")}
      </label>
      <div className="radioOption">
        <input
          type="radio"
          name="computerTurn"
          value="whiteTurn"
          id="whiteTurn"
          onChange={() => handleChangeComputerTempSide(true)}
          checked={computerHasWhite}
        />
        <label htmlFor="whiteTurn">
          {t("dialogs.positionEditor.computerSide.white")}
        </label>
      </div>
      <div className="radioOption">
        <input
          type="radio"
          name="computerTurn"
          value="blackTurn"
          id="blackTurn"
          onChange={() => handleChangeComputerTempSide(false)}
          checked={!computerHasWhite}
        />
        <label htmlFor="blackTurn">
          {t("dialogs.positionEditor.computerSide.black")}
        </label>
      </div>
    </div>
  );
}

export default ComputerSideSelector;
