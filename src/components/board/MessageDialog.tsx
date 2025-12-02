import { Dialog } from "radix-ui";
import "./MessageDialog.css";
import { Cross2Icon } from "@radix-ui/react-icons";

interface MessageDialogParams {
  isOpen: boolean;
  message: string;
  onOpenChange: (newState: boolean) => void;
}

function MessageDialog({ isOpen, onOpenChange, message }: MessageDialogParams) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
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
