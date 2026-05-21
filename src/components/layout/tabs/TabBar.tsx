"use client";

import { useTabs } from "@/hooks/useTabs";
import { TabItem } from "@/components/layout/tabs/TabItem";
import { BookmarkTabs } from "@/components/layout/tabs/BookmarkTabs";
import { TabLimitModal } from "@/components/layout/tabs/TabLimitModal";

export function TabBar() {
  const {
    workTabs,
    bookmarkTabs,
    activeKey,
    setActiveTab,
    closeTab,
    showLimitModal,
    closeLimitModal,
    closeCandidateKey,
    setCloseCandidate,
    pendingTab,
    confirmTabReplace,
  } = useTabs();

  return (
    <>
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
      </div>

      <TabLimitModal
        open={showLimitModal}
        workTabs={workTabs}
        bookmarkTabs={bookmarkTabs}
        pendingTab={pendingTab}
        closeCandidateKey={closeCandidateKey}
        onSelectCandidate={setCloseCandidate}
        onConfirm={confirmTabReplace}
        onClose={closeLimitModal}
      />
    </>
  );
}
