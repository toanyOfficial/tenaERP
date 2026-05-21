"use client";

import { TabItem } from "@/components/layout/tabs/TabItem";
import type { ERPTab } from "@/types/tab";

type Props = {
  tabs: ERPTab[];
  activeKey: string | null;
  onClick: (key: string) => void;
};

export function BookmarkTabs({ tabs, activeKey, onClick }: Props) {
  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => (
        <TabItem key={tab.key} tab={tab} active={activeKey === tab.key} onClick={() => onClick(tab.key)} />
      ))}
    </div>
  );
}
