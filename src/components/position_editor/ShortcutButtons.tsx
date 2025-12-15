import { t } from "i18next";
import "./ShortcutButtons.css";
import {
  PositionEditorActionType,
  usePositionEditorDispatch,
} from "../../stores/game/PositionEditorContext";

function ShortcutButtons() {
  const dispatch = usePositionEditorDispatch();

  function handleDefaultPositionRequest() {
    dispatch({
      type: PositionEditorActionType.resetToDefault,
    });
  }

  return (
    <div className="editorShortcutButtons">
      <button>
        {t("dialogs.positionEditor.shortcutButtons.resetPosition")}
      </button>
      <button onClick={handleDefaultPositionRequest}>
        {t("dialogs.positionEditor.shortcutButtons.defaultPosition")}
      </button>
      <button>
        {t("dialogs.positionEditor.shortcutButtons.copyPosition")}
      </button>
      <button>
        {t("dialogs.positionEditor.shortcutButtons.pastePosition")}
      </button>
    </div>
  );
}

export default ShortcutButtons;
