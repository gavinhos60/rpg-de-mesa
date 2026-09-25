import type { ReactNode } from "react";
import {
  floatingPopupStackOffset,
} from "../../hooks/useFloatingPopupStack";
import { FloatingPopupWindow } from "./FloatingPopupWindow";

interface DocumentExpandModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  zIndex?: number;
  stackIndex?: number;
  onActivate?: () => void;
}

export function DocumentExpandModal({
  title,
  subtitle,
  onClose,
  children,
  zIndex = 86,
  stackIndex = 0,
  onActivate,
}: DocumentExpandModalProps) {
  return (
    <FloatingPopupWindow
      size="document"
      zIndex={zIndex}
      initialOffset={floatingPopupStackOffset(stackIndex)}
      subtitle={subtitle}
      title={title.trim() || "Sem título"}
      ariaLabel={title}
      onClose={onClose}
      onActivate={onActivate}
    >
      <div className="px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </FloatingPopupWindow>
  );
}
