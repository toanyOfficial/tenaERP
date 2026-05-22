import type { ReactNode } from "react";
import { ERPLayout } from "@/components/layout";
import { requireAuthPage } from "@/modules/auth/helpers/auth";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  await requireAuthPage();

  return <ERPLayout>{children}</ERPLayout>;
}
