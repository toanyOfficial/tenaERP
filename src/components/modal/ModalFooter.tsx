"use client";

import type { ReactNode } from "react";

export function ModalFooter({ children }: { children: ReactNode }) {
  return <footer className="border-t border-slate-200 px-4 py-3">{children}</footer>;
}
