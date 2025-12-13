import { useTranslation } from "react-i18next";
import "./CustomPositionDialog.css";
import { Dialog, VisuallyHidden } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import ChessPositionEditor from "../position_editor/ChessPositionEditor";

interface CustomPositionDialogParams {
  isOpen: boolean;
  onOpenChange: (newState: boolean) => void;
  onConfirmCb: () => void;
  onCancelCb: () => void;
}

function CustomPositionDialog({
  isOpen,
  onOpenChange,
  onConfirmCb,
  onCancelCb,
}: CustomPositionDialogParams) {
  const { t } = useTranslation();
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
          <ChessPositionEditor />
          <div className="answerButtons">
            <button onClick={onCancelCb}>
              {t("dialogs.confirmationDialog.buttons.cancel")}
            </button>
            <button onClick={onConfirmCb}>
              {t("dialogs.confirmationDialog.buttons.confirm")}
            </button>
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CustomPositionDialog;
