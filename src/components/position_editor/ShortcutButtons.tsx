import { t } from "i18next";
import "./ShortcutButtons.css";
import {
  PositionEditorActionType,
  usePositionEditorDispatch,
} from "../../stores/game/PositionEditorContext";

interface ShortcutButtonsParams {
  copyToClipboardCb: () => void;
  pasteFromClipboardCb: () => void;
}

function ShortcutButtons({
  copyToClipboardCb,
  pasteFromClipboardCb,
}: ShortcutButtonsParams) {
  const dispatch = usePositionEditorDispatch();

  function handleDefaultPositionRequest() {
    dispatch({
      type: PositionEditorActionType.resetToDefault,
    });
  }

  function handleResetPositionRequest() {
    dispatch({
      type: PositionEditorActionType.resetToLoaded,
    });
  }

  function handleErasePositionRequest() {
    dispatch({
      type: PositionEditorActionType.erasePosition,
    });
  }

  return (
    <div className="editorShortcutButtons">
      <button onClick={handleResetPositionRequest}>
        {t("dialogs.positionEditor.shortcutButtons.resetPosition")}
      </button>
      <button onClick={handleDefaultPositionRequest}>
        {t("dialogs.positionEditor.shortcutButtons.defaultPosition")}
      </button>
      <button onClick={copyToClipboardCb}>
        {t("dialogs.positionEditor.shortcutButtons.copyPosition")}
      </button>
      <button onClick={pasteFromClipboardCb}>
        {t("dialogs.positionEditor.shortcutButtons.pastePosition")}
      </button>
      <button onClick={handleErasePositionRequest}>
        {t("dialogs.positionEditor.shortcutButtons.erasePosition")}
      </button>
    </div>
  );
}

export default ShortcutButtons;
