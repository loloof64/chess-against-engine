import { Dialog, VisuallyHidden } from "radix-ui";
import "./MessageDialog.css";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

interface MessageDialogParams {
  isOpen: boolean;
  message: string;
  onOpenChange: (newState: boolean) => void;
}

function MessageDialog({ isOpen, onOpenChange, message }: MessageDialogParams) {
  const { t } = useTranslation();
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <VisuallyHidden.Root>
            <Dialog.Title>{t("board.messageDialog.title")}</Dialog.Title>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root>
            <Dialog.Description>
              {t("board.messageDialog.description")}
            </Dialog.Description>
          </VisuallyHidden.Root>
          <span className="messageZone">{message}</span>
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

export default MessageDialog;
