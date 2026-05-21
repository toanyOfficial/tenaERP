"use client";

import { useTabs } from "@/hooks/useTabs";
import { TabItem } from "@/components/layout/tabs/TabItem";
import { BookmarkTabs } from "@/components/layout/tabs/BookmarkTabs";

export function TabBar() {
  const {
    workTabs,
    bookmarkTabs,
    activeKey,
    setActiveTab,
    closeTab,
    showLimitModal,
    closeLimitModal,
  } = useTabs();

  return (
    <div className="border-b border-slate-200 bg-slate-50 px-3 pt-2">
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-end gap-1 overflow-x-auto">
          {workTabs.map((tab) => (
            <TabItem
              key={tab.key}
              tab={tab}
              active={activeKey === tab.key}
              onClick={() => setActiveTab(tab.key)}
              onClose={() => closeTab(tab.key)}
            />
          ))}
        </div>
        <BookmarkTabs tabs={bookmarkTabs} activeKey={activeKey} onClick={setActiveTab} />
      </div>

      {showLimitModal ? (
        <div className="my-2 rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800">
          현재사용중 탭은 최대 5개까지 가능합니다.
          <button type="button" className="ml-2 underline" onClick={closeLimitModal}>확인</button>
        </div>
      ) : null}
    </div>
  );
}
