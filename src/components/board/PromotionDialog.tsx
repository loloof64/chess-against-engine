import "./PromotionDialog.css";
import { Dialog, VisuallyHidden } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";

interface PromotionDialogParams {
  whiteTurn: boolean;
  isOpen: boolean;
  onOpenChange: (newState: boolean) => void;
  onSelection: (piece: string) => void;
}

function PromotionDialog({
  whiteTurn,
  isOpen,
  onOpenChange,
  onSelection,
}: PromotionDialogParams) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <VisuallyHidden.Root asChild>
            <Dialog.Title>Promotion choice</Dialog.Title>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root asChild>
            <Dialog.Description>
              Choose your promotion piece.
            </Dialog.Description>
          </VisuallyHidden.Root>
          <fieldset className="Fieldset">
            <button className="dlgButton" onClick={() => onSelection("q")}>
              {whiteTurn ? "♕" : "♛"}
            </button>
            <button className="dlgButton" onClick={() => onSelection("r")}>
              {whiteTurn ? "♖" : "♜"}
            </button>
            <button className="dlgButton" onClick={() => onSelection("b")}>
              {whiteTurn ? "♗" : "♝"}
            </button>
            <button className="dlgButton" onClick={() => onSelection("n")}>
              {whiteTurn ? "♘" : "♞"}
            </button>
          </fieldset>
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

export default PromotionDialog;
