import type { ReactNode } from "react";

type MainContentProps = {
  children: ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  return <main className="flex-1 overflow-y-auto bg-slate-50 p-5">{children}</main>;
}
