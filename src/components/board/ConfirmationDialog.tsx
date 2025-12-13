import { Dialog, VisuallyHidden } from "radix-ui";
import "./Dialog.css";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

interface ConfirmationDialogParams {
  isOpen: boolean;
  message: string;
  onOpenChange: (newState: boolean) => void;
  onConfirmCb: () => void;
  onCancelCb: () => void;
}

function ConfirmationDialog({
  isOpen,
  onOpenChange,
  onCancelCb,
  onConfirmCb,
  message,
}: ConfirmationDialogParams) {
  const { t } = useTranslation();
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <VisuallyHidden.Root>
            <Dialog.Title>{t("board.confirmationDialog.title")}</Dialog.Title>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root>
            <Dialog.Description>
              {t("board.confirmationDialog.description")}
            </Dialog.Description>
          </VisuallyHidden.Root>
          <span className="messageZone">{message}</span>
          <div className="answerButtons">
            <button onClick={onCancelCb}>
              {t("board.confirmationDialog.buttons.cancel")}
            </button>
            <button onClick={onConfirmCb}>
              {t("board.confirmationDialog.buttons.confirm")}
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

export default ConfirmationDialog;
