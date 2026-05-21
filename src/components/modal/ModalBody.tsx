"use client";

import type { ReactNode } from "react";

export function ModalBody({ children }: { children: ReactNode }) {
  return <section className="max-h-[70vh] overflow-y-auto px-4 py-3">{children}</section>;
}
