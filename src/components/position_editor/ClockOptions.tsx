import { t } from "i18next";
import "./ClockOptions.css";
import {
  PositionEditorActionType,
  usePositionEditor,
  usePositionEditorDispatch,
} from "../../stores/game/PositionEditorContext";

function ClockOptions() {
  const dispatch = usePositionEditorDispatch();
  const {
    editedState: {
      useClock,
      baseTimeHours,
      baseTimeMinutes,
      baseTimeSeconds,
      baseIncrementSeconds,
      useDifferentTimes,
      cpuTimeHours,
      cpuTimeMinutes,
      cpuTimeSeconds,
      cpuIncrementSeconds,
    },
  } = usePositionEditor();

  function handleChangeUseClock(use: boolean) {
    dispatch({
      type: PositionEditorActionType.setUseClock,
      value: use,
    });
  }

  function handleChangeBaseTimeHours(hours: number) {
    dispatch({
      type: PositionEditorActionType.setBaseTimeHours,
      value: hours,
    });
  }

  function handleChangeBaseTimeMinutes(minutes: number) {
    dispatch({
      type: PositionEditorActionType.setBaseTimeMinutes,
      value: minutes,
    });
  }

  function handleChangeBaseTimeSeconds(seconds: number) {
    dispatch({
      type: PositionEditorActionType.setBaseTimeSeconds,
      value: seconds,
    });
  }

  function handleChangeBaseTimeIncrement(seconds: number) {
    dispatch({
      type: PositionEditorActionType.setBaseIncrementSeconds,
      value: seconds,
    });
  }

  function handleChangeUseDifferentTimes(newState: boolean) {
    dispatch({
      type: PositionEditorActionType.setUseDifferentTimes,
      value: newState,
    });
  }

  function handleChangeCPUTimeHours(hours: number) {
    dispatch({
      type: PositionEditorActionType.setCPUTimeHours,
      value: hours,
    });
  }

  function handleChangeCPUTimeMinutes(minutes: number) {
    dispatch({
      type: PositionEditorActionType.setCPUTimeMinutes,
      value: minutes,
    });
  }

  function handleChangeCPUTimeSeconds(seconds: number) {
    dispatch({
      type: PositionEditorActionType.setCPUTimeSeconds,
      value: seconds,
    });
  }

  function handleChangeCPUTimeIncrement(seconds: number) {
    dispatch({
      type: PositionEditorActionType.setCPUIncrementSeconds,
      value: seconds,
    });
  }

  return (
    <div className="clockOptions">
      <div className="useClock">
        <label>{t("dialogs.positionEditor.clockOptions.useClock.label")}</label>
        <div>
          <input
            type="radio"
            name="useClock"
            value="useClockYes"
            checked={useClock}
            onChange={() => handleChangeUseClock(true)}
          />
          <label htmlFor="useClockYes">
            {t("dialogs.positionEditor.clockOptions.useClock.yes")}
          </label>
        </div>
        <div>
          <input
            type="radio"
            name="useClock"
            value="useClockNo"
            checked={!useClock}
            onChange={() => handleChangeUseClock(false)}
          />
          <label htmlFor="useClockNo">
            {t("dialogs.positionEditor.clockOptions.useClock.no")}
          </label>
        </div>
      </div>
      {useClock && (
        <>
          <div className="baseTime">
            <label>
              {t("dialogs.positionEditor.clockOptions.baseTimeLabel")}
            </label>
            <div className="baseTimeField">
              <input
                type="number"
                min="0"
                max="6"
                name="baseTimeHours"
                value={baseTimeHours}
                onChange={(e) =>
                  handleChangeBaseTimeHours(Number(e.target.value))
                }
              />
              <label htmlFor="baseTimeHours">
                {t("dialogs.positionEditor.clockOptions.hours")}
              </label>
            </div>
            <div className="baseTimeField">
              <input
                type="number"
                min="0"
                max="59"
                name="baseTimeMinutes"
                value={baseTimeMinutes}
                onChange={(e) =>
                  handleChangeBaseTimeMinutes(Number(e.target.value))
                }
              />
              <label htmlFor="baseTimeMinutes">
                {t("dialogs.positionEditor.clockOptions.minutes")}
              </label>
            </div>
            <div className="baseTimeField">
              <input
                type="number"
                min="0"
                max="59"
                name="baseTimeSeconds"
                value={baseTimeSeconds}
                onChange={(e) =>
                  handleChangeBaseTimeSeconds(Number(e.target.value))
                }
              />
              <label htmlFor="baseTimeSeconds">
                {t("dialogs.positionEditor.clockOptions.seconds")}
              </label>
            </div>
            <div className="baseTimeField">
              <label htmlFor="baseTimeIncrement">+</label>
              <input
                type="number"
                min="0"
                max="59"
                name="baseTimeIncrement"
                value={baseIncrementSeconds}
                onChange={(e) =>
                  handleChangeBaseTimeIncrement(Number(e.target.value))
                }
              />
              s
            </div>
          </div>
          <div className="useDiffTime">
            <label>
              {t("dialogs.positionEditor.clockOptions.useDiffTime.label")}
            </label>
            <div>
              <input
                type="radio"
                name="usDiffTime"
                value="useDiffTimeYes"
                checked={useDifferentTimes}
                onChange={() => handleChangeUseDifferentTimes(true)}
              />
              <label htmlFor="useDiffTimeYes">
                {t("dialogs.positionEditor.clockOptions.useDiffTime.yes")}
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="useDiffTime"
                value="useDiffTimeNo"
                checked={!useDifferentTimes}
                onChange={() => handleChangeUseDifferentTimes(false)}
              />
              <label htmlFor="useDiffTimeNo">
                {t("dialogs.positionEditor.clockOptions.useDiffTime.no")}
              </label>
            </div>
          </div>
          {useDifferentTimes && (
            <div className="baseTime">
              <label>
                {t("dialogs.positionEditor.clockOptions.baseTimeLabel")}
              </label>
              <div className="baseTimeField">
                <input
                  type="number"
                  min="0"
                  max="6"
                  name="cpuTimeHours"
                  value={cpuTimeHours}
                  onChange={(e) =>
                    handleChangeCPUTimeHours(Number(e.target.value))
                  }
                />
                <label htmlFor="cpuTimeHours">
                  {t("dialogs.positionEditor.clockOptions.hours")}
                </label>
              </div>
              <div className="baseTimeField">
                <input
                  type="number"
                  min="0"
                  max="59"
                  name="cpuTimeMinutes"
                  value={cpuTimeMinutes}
                  onChange={(e) =>
                    handleChangeCPUTimeMinutes(Number(e.target.value))
                  }
                />
                <label htmlFor="cpuTimeMinutes">
                  {t("dialogs.positionEditor.clockOptions.minutes")}
                </label>
              </div>
              <div className="baseTimeField">
                <input
                  type="number"
                  min="0"
                  max="59"
                  name="cpuTimeSeconds"
                  value={cpuTimeSeconds}
                  onChange={(e) =>
                    handleChangeCPUTimeSeconds(Number(e.target.value))
                  }
                />
                <label htmlFor="cpuTimeSeconds">
                  {t("dialogs.positionEditor.clockOptions.seconds")}
                </label>
              </div>
              <div className="baseTimeField">
                <label htmlFor="cpuTimeIncrement">+</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  name="cpuTimeIncrement"
                  value={cpuIncrementSeconds}
                  onChange={(e) =>
                    handleChangeCPUTimeIncrement(Number(e.target.value))
                  }
                />
                s
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ClockOptions;
