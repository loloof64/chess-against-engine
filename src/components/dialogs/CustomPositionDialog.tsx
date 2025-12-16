import { useTranslation } from "react-i18next";
import "./CustomPositionDialog.css";
import { Dialog, Tabs, VisuallyHidden } from "radix-ui";
import BoardEditor from "../position_editor/BoardEditor";
import AdvancedOptions from "../position_editor/AdvancedOptions";
import ShortcutButtons from "../position_editor/ShortcutButtons";
import {
  PositionEditorActionType,
  usePositionEditor,
  usePositionEditorDispatch,
} from "../../stores/game/PositionEditorContext";
import { Chess } from "chess.js";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";

interface CustomPositionDialogParams {
  isOpen: boolean;
  onOpenChange: (newState: boolean) => void;
  onConfirmCb: () => void;
  onCancelCb: () => void;
  onPasteErrorCb: () => void;
}

function CustomPositionDialog({
  isOpen,
  onOpenChange,
  onConfirmCb,
  onCancelCb,
  onPasteErrorCb,
}: CustomPositionDialogParams) {
  const { t } = useTranslation();
  const { currentPosition } = usePositionEditor();
  const positionEditorDispatch = usePositionEditorDispatch();

  async function handleCopyToClipboardRequest() {
    try {
      await writeText(currentPosition);
    } catch (err) {
      console.error(err);
    }
  }

  async function handlePasteFromClipboardRequest() {
    try {
      const newPosition = await readText();
      try {
        new Chess(newPosition);
        positionEditorDispatch({
          type: PositionEditorActionType.changeCurrentPosition,
          value: newPosition,
        });
      } catch (err) {
        console.error(err);
        onPasteErrorCb();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <VisuallyHidden.Root>
            <Dialog.Title>{t("dialogs.messageDialog.title")}</Dialog.Title>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root>
            <Dialog.Description>
              {t("dialogs.messageDialog.description")}
            </Dialog.Description>
          </VisuallyHidden.Root>
          <div className="customPositionDialogRoot">
            <Tabs.Root
              defaultValue="board"
              orientation="vertical"
              className="tabsRoot"
            >
              <Tabs.List aria-label={t("dialogs.positionEditor.ariaLabel")}>
                <Tabs.Trigger value="board">
                  {t("dialogs.positionEditor.tabBoard")}
                </Tabs.Trigger>
                <Tabs.Trigger value="advanced">
                  {t("dialogs.positionEditor.tabAdvanced")}
                </Tabs.Trigger>
                <Tabs.Trigger value="buttons">
                  {t("dialogs.positionEditor.tabButtons")}
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="board" className="tabContent">
                <BoardEditor />
              </Tabs.Content>
              <Tabs.Content value="advanced" className="tabContent">
                <AdvancedOptions />
              </Tabs.Content>
              <Tabs.Content value="buttons" className="tabContent">
                <ShortcutButtons
                  copyToClipboardCb={handleCopyToClipboardRequest}
                  pasteFromClipboardCb={handlePasteFromClipboardRequest}
                />
              </Tabs.Content>
            </Tabs.Root>
            <div className="answerButtons">
              <button className="action" onClick={onCancelCb}>
                {t("dialogs.confirmationDialog.buttons.cancel")}
              </button>
              <button className="action" onClick={onConfirmCb}>
                {t("dialogs.confirmationDialog.buttons.confirm")}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CustomPositionDialog;
