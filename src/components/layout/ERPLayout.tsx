import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MainContent } from "@/components/layout/MainContent";
import { TabBar } from "@/components/layout/tabs/TabBar";

type ERPLayoutProps = {
  children: ReactNode;
};

export function ERPLayout({ children }: ERPLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-slate-100">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <TabBar />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </div>
  );
}
