import { t } from 'i18next';
import './ClockOptions.css'
import { PositionEditorActionType, usePositionEditor, usePositionEditorDispatch } from '../../stores/game/PositionEditorContext';

function ClockOptions() {
    const dispatch = usePositionEditorDispatch();
    const { useClock, baseTimeHours, baseTimeMinutes, baseTimeSeconds } = usePositionEditor();

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
            {
                useClock && (
                    <div className="baseTime">
                        <label>{t("dialogs.positionEditor.clockOptions.baseTimeLabel")}</label>
                        <div className='baseTimeField'>
                            <input type='number' min="0" max="6" name='baseTimeHours' value={baseTimeHours} onChange={e => handleChangeBaseTimeHours(Number(e.target.value))} />
                            <label htmlFor='baseTimeHours'>{t("dialogs.positionEditor.clockOptions.hours")}</label>
                        </div>
                        <div className='baseTimeField'>
                            <input type='number' min="0" max="59" name='baseTimeMinutes' value={baseTimeMinutes} onChange={e => handleChangeBaseTimeMinutes(Number(e.target.value))} />
                            <label htmlFor='baseTimeMinutes'>{t("dialogs.positionEditor.clockOptions.minutes")}</label>
                        </div>
                        <div className='baseTimeField'>
                            <input type='number' min="0" max="59" name='baseTimeSeconds' value={baseTimeSeconds} onChange={e => handleChangeBaseTimeSeconds(Number(e.target.value))}     />
                            <label htmlFor='baseTimeSeconds'>{t("dialogs.positionEditor.clockOptions.seconds")}</label>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ClockOptions;