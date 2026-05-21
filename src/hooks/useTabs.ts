"use client";

import { useMemo, useState } from "react";
import type { ERPTab, TabState } from "@/types/tab";

const MAX_WORK_TABS = 5;
const MAX_BOOKMARK_TABS = 10;

const DEFAULT_WORK_TABS: ERPTab[] = [
  { key: "erp-home", label: "대시보드", href: "/erp", type: "work" },
];

export function useTabs() {
  const [state, setState] = useState<TabState>({
    workTabs: DEFAULT_WORK_TABS,
    bookmarkTabs: [],
    activeKey: DEFAULT_WORK_TABS[0].key,
    showLimitModal: false,
  });

  function setActiveTab(key: string) {
    setState((prev) => ({ ...prev, activeKey: key }));
  }

  function openTab(tab: Omit<ERPTab, "type">) {
    setState((prev) => {
      const existing = prev.workTabs.find((item) => item.key === tab.key);
      if (existing) return { ...prev, activeKey: existing.key };
      if (prev.workTabs.length >= MAX_WORK_TABS) return { ...prev, showLimitModal: true };
      return { ...prev, workTabs: [...prev.workTabs, { ...tab, type: "work" }], activeKey: tab.key };
    });
  }

  function closeTab(key: string) {
    setState((prev) => {
      const nextTabs = prev.workTabs.filter((item) => item.key !== key);
      if (nextTabs.length === prev.workTabs.length) return prev;
      const nextActive = prev.activeKey === key ? (nextTabs[nextTabs.length - 1]?.key ?? null) : prev.activeKey;
      return { ...prev, workTabs: nextTabs, activeKey: nextActive };
    });
  }

  function toggleBookmark(tab: Omit<ERPTab, "type">) {
    setState((prev) => {
      const exists = prev.bookmarkTabs.some((item) => item.key === tab.key);
      if (exists) {
        return { ...prev, bookmarkTabs: prev.bookmarkTabs.filter((item) => item.key !== tab.key) };
      }
      if (prev.bookmarkTabs.length >= MAX_BOOKMARK_TABS) return prev;
      return { ...prev, bookmarkTabs: [...prev.bookmarkTabs, { ...tab, type: "bookmark" }] };
    });
  }

  function closeLimitModal() {
    setState((prev) => ({ ...prev, showLimitModal: false }));
  }

  return {
    ...state,
    workTabCount: useMemo(() => state.workTabs.length, [state.workTabs.length]),
    openTab,
    closeTab,
    setActiveTab,
    toggleBookmark,
    closeLimitModal,
  };
}
