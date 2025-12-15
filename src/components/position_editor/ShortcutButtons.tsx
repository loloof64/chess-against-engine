import { t } from "i18next";
import "./ShortcutButtons.css";

function ShortcutButtons() {
  return (
    <div className="editorShortcutButtons">
      <button>
        {t("dialogs.positionEditor.shortcutButtons.resetPosition")}
      </button>
      <button>
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
