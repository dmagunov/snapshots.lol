import { DialogOverlay } from "@reach/dialog";

import ShadowBox from "components/ShadowBox/ShadowBox";

import {
  DialogContentStyled,
  DialogContentFrame,
  CloseButton,
} from "./Dialog.styles";

type DialogComponentProps = {
  zIndex: number;
  isOpen?: boolean;
  showCloseButton?: boolean;
  onDismiss?: () => void;
  children: React.ReactNode;
};

export default function DialogComponent({
  zIndex,
  isOpen = true,
  showCloseButton = false,
  onDismiss,
  children,
}: DialogComponentProps) {
  return (
    <DialogOverlay
      style={{ background: "rgba(0, 0, 0, .5)", zIndex }}
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <DialogContentStyled>
        <ShadowBox size={48}>
          <DialogContentFrame>
            {showCloseButton && (
              <CloseButton title="Close" onClick={onDismiss}>
                ×
              </CloseButton>
            )}

            {children}
          </DialogContentFrame>
        </ShadowBox>
      </DialogContentStyled>
    </DialogOverlay>
  );
}
