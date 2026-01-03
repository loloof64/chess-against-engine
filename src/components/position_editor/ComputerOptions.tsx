import { t } from "i18next";
import "./ComputerOptions.css";
import {
  PositionEditorActionType,
  usePositionEditor,
  usePositionEditorDispatch,
} from "../../stores/game/PositionEditorContext";
import { useGame } from "../../stores/game/GameContext";

function ComputerOptions() {
  const { useSkillLevel, skillLevelMin, skillLevelMax } = useGame();
  const dispatch = usePositionEditorDispatch();
  const {
    editedState: { computerHasWhite, computerSkillLevel },
  } = usePositionEditor();

  function handleChangeComputerTempSide(hasWhiteSide: boolean) {
    dispatch({
      type: PositionEditorActionType.setComputerSide,
      value: hasWhiteSide,
    });
  }

  function handleSkillLevelChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: PositionEditorActionType.setComputerSkillLevel,
      value: parseInt(event.target.value),
    });
  }

  return (
    <div className="computerOptions">
      <div className="computerSideSelector">
        <label>{t("dialogs.positionEditor.computerSide.label")}</label>
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
      {useSkillLevel && (
        <div className="computerSkillLevel">
          <div className="skillLabel">
            <label htmlFor="computerLevel">
              {t("dialogs.positionEditor.computerLevel.label")}
            </label>
            <label>{computerSkillLevel}</label>
          </div>
          <input
            type="range"
            name="computerLevel"
            min={skillLevelMin}
            max={skillLevelMax}
            value={computerSkillLevel}
            step="1"
            onChange={handleSkillLevelChange}
          />
        </div>
      )}
    </div>
  );
}

export default ComputerOptions;
