"use client";

import { useEffect } from "react";
import { ModalBody } from "@/components/modal/ModalBody";
import { ModalFooter } from "@/components/modal/ModalFooter";
import { ModalHeader } from "@/components/modal/ModalHeader";
import { ModalLayerProvider, useModalLayer } from "@/components/modal/ModalContext";
import type { ModalProps, ModalSize } from "@/components/modal/modal.types";

const MODAL_SIZE_ORDER: ModalSize[] = ["mini", "small", "medium", "large"];
const MODAL_WIDTH_CLASS: Record<ModalSize, string> = {
  mini: "max-w-[320px]",
  small: "max-w-[640px]",
  medium: "max-w-[960px]",
  large: "max-w-[1280px]",
};

function canNest(parentSize: ModalSize | undefined, currentSize: ModalSize) {
  if (!parentSize) return true;
  return MODAL_SIZE_ORDER.indexOf(currentSize) < MODAL_SIZE_ORDER.indexOf(parentSize);
}

export function Modal({
  open,
  title,
  size = "small",
  onClose,
  children,
  footer,
  closable = true,
}: ModalProps) {
  const layer = useModalLayer();

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && closable) {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closable, onClose]);

  if (!open) return null;

  if (!canNest(layer.parentSize, size)) {
    throw new Error("Nested modal must be smaller than parent modal size.");
  }

  return (
    <ModalLayerProvider value={{ stackDepth: layer.stackDepth + 1, parentSize: size }}>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
        <div className={`w-full ${MODAL_WIDTH_CLASS[size]} overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xl`}>
          <ModalHeader title={title} onClose={closable ? onClose : undefined} />
          <ModalBody>{children}</ModalBody>
          {footer ? <ModalFooter>{footer}</ModalFooter> : null}
        </div>
      </div>
    </ModalLayerProvider>
  );
}
