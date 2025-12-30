import { t } from 'i18next';
import './ClockOptions.css'
import { PositionEditorActionType, usePositionEditor, usePositionEditorDispatch } from '../../stores/game/PositionEditorContext';

function ClockOptions() {
    const dispatch = usePositionEditorDispatch();
    const { useClock } = usePositionEditor();

function handleChangeUseClock(use: boolean) {
    dispatch({
        type: PositionEditorActionType.setUseClock,
        value: use,
    });
}

    return (
        <div className="clockOptions">
            <div className="useClock">
                <label>
                    {t("dialogs.positionEditor.clockOptions.useClock.label")}
                </label>
                <div>
                    <input type='radio' name="useClock" value="useClockYes" checked={useClock} onChange={() => handleChangeUseClock(true)} />
                    <label htmlFor='useClockYes'>
                        {t("dialogs.positionEditor.clockOptions.useClock.yes")}
                    </label>
                </div>
                <div>
                    <input type='radio' name="useClock" value="useClockNo" checked={!useClock} onChange={() => handleChangeUseClock(false)} />
                    <label htmlFor='useClockNo'>
                        {t("dialogs.positionEditor.clockOptions.useClock.no")}
                    </label>
                </div>
            </div>
        </div>
    )
}

export default ClockOptions;