import type { ReactNode } from "react";
import { ERPLayout } from "@/components/layout";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <ERPLayout>{children}</ERPLayout>;
}
