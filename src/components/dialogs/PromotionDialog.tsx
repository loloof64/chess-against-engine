import "./Dialog.css";
import { Dialog, VisuallyHidden } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <VisuallyHidden.Root asChild>
            <Dialog.Title>{t("dialogs.promotionDialog.title")}</Dialog.Title>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root asChild>
            <Dialog.Description>
              {t("dialogs.promotionDialog.description")}
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
