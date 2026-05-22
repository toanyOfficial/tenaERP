"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ERPTab, TabState } from "@/types/tab";

const MAX_WORK_TABS = 5;
const MAX_BOOKMARK_TABS = 10;

const DEFAULT_WORK_TABS: ERPTab[] = [{ key: "erp-home", label: "대시보드", href: "/erp", type: "work" }];

function toTabFromPath(pathname: string): Omit<ERPTab, "type"> | null {
  if (!pathname.startsWith("/erp")) return null;
  if (pathname === "/erp") return { key: "erp-home", label: "대시보드", href: "/erp" };
  if (pathname.startsWith("/erp/employee")) return { key: "erp-employee", label: "인원관리", href: "/erp/employee" };
  if (pathname.startsWith("/erp/account")) return { key: "erp-account", label: "계정관리", href: "/erp/account" };
  if (pathname.startsWith("/erp/profit-loss")) return { key: "erp-profit-loss", label: "손익관리", href: "/erp/profit-loss" };

  const key = pathname.replace(/\//g, "-");
  return { key, label: pathname.split("/").filter(Boolean).at(-1) ?? "ERP", href: pathname };
}

export function useTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<TabState>({
    workTabs: DEFAULT_WORK_TABS,
    bookmarkTabs: [],
    activeKey: DEFAULT_WORK_TABS[0].key,
    showLimitModal: false,
    pendingTab: null,
    closeCandidateKey: DEFAULT_WORK_TABS[0].key,
  });

  useEffect(() => {
    const tab = toTabFromPath(pathname);
    if (!tab) return;

    setState((prev) => {
      const exists = prev.workTabs.find((item) => item.key === tab.key);
      if (exists) {
        return { ...prev, activeKey: tab.key };
      }

      if (prev.workTabs.length >= MAX_WORK_TABS) {
        return {
          ...prev,
          activeKey: tab.key,
          workTabs: [...prev.workTabs.slice(1), { ...tab, type: "work" }],
        };
      }

      return {
        ...prev,
        workTabs: [...prev.workTabs, { ...tab, type: "work" }],
        activeKey: tab.key,
      };
    });
  }, [pathname]);

  function setActiveTab(key: string) {
    setState((prev) => {
      const target = [...prev.workTabs, ...prev.bookmarkTabs].find((tab) => tab.key === key);
      if (target) router.push(target.href);
      return { ...prev, activeKey: key };
    });
  }

  function openTab(tab: Omit<ERPTab, "type">) {
    setState((prev) => {
      const existing = prev.workTabs.find((item) => item.key === tab.key);
      if (existing) return { ...prev, activeKey: existing.key };
      if (prev.workTabs.length >= MAX_WORK_TABS) {
        return {
          ...prev,
          showLimitModal: true,
          pendingTab: { ...tab, type: "work" as const },
          closeCandidateKey: prev.workTabs[0]?.key ?? null,
        };
      }
      return { ...prev, workTabs: [...prev.workTabs, { ...tab, type: "work" }], activeKey: tab.key };
    });
  }

  function closeTab(key: string) {
    setState((prev) => {
      const nextTabs = prev.workTabs.filter((item) => item.key !== key);
      if (nextTabs.length === prev.workTabs.length) return prev;
      const nextActive = prev.activeKey === key ? (nextTabs[nextTabs.length - 1]?.key ?? null) : prev.activeKey;
      const nextTab = nextTabs.find((tab) => tab.key === nextActive);
      if (nextTab) router.push(nextTab.href);
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

  function setCloseCandidate(key: string) {
    setState((prev) => ({ ...prev, closeCandidateKey: key }));
  }

  function confirmTabReplace() {
    setState((prev) => {
      if (!prev.pendingTab || !prev.closeCandidateKey) {
        return { ...prev, showLimitModal: false, pendingTab: null };
      }

      const filtered = prev.workTabs.filter((tab) => tab.key !== prev.closeCandidateKey);
      const nextWorkTabs = [...filtered, prev.pendingTab];
      router.push(prev.pendingTab.href);

      return {
        ...prev,
        workTabs: nextWorkTabs,
        activeKey: prev.pendingTab.key,
        showLimitModal: false,
        pendingTab: null,
      };
    });
  }

  function closeLimitModal() {
    setState((prev) => ({ ...prev, showLimitModal: false, pendingTab: null }));
  }

  return {
    ...state,
    workTabCount: useMemo(() => state.workTabs.length, [state.workTabs.length]),
    openTab,
    closeTab,
    setActiveTab,
    toggleBookmark,
    closeLimitModal,
    setCloseCandidate,
    confirmTabReplace,
  };
}
