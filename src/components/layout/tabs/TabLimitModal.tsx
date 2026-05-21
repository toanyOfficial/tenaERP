"use client";

import type { ERPTab } from "@/types/tab";

type Props = {
  open: boolean;
  workTabs: ERPTab[];
  bookmarkTabs: ERPTab[];
  pendingTab: ERPTab | null;
  closeCandidateKey: string | null;
  onSelectCandidate: (key: string) => void;
  onConfirm: () => void;
  onClose: () => void;
};

export function TabLimitModal({
  open,
  workTabs,
  bookmarkTabs,
  pendingTab,
  closeCandidateKey,
  onSelectCandidate,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-slate-300 bg-white shadow-lg">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">탭 관리</h2>
          <p className="mt-1 text-xs text-slate-600">현재사용중 탭은 최대 5개입니다. 닫을 탭을 선택해주세요.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4">
          <section>
            <p className="mb-2 text-xs font-semibold text-slate-500">현재사용중 탭</p>
            <ul className="space-y-1">
              {workTabs.map((tab, index) => (
                <li key={tab.key}>
                  <button
                    type="button"
                    onClick={() => onSelectCandidate(tab.key)}
                    className={`w-full rounded border px-2 py-2 text-left text-xs ${closeCandidateKey === tab.key ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white"}`}
                  >
                    <span className="mr-2 text-slate-400">{index === 0 ? "(oldest)" : ""}</span>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="mb-2 text-xs font-semibold text-slate-500">북마크 탭</p>
            <ul className="space-y-1">
              {bookmarkTabs.length === 0 ? <li className="text-xs text-slate-400">북마크 없음</li> : null}
              {bookmarkTabs.map((tab) => (
                <li key={tab.key} className="rounded border border-slate-200 bg-slate-50 px-2 py-2 text-xs">
                  {tab.label}
                </li>
              ))}
            </ul>

            <p className="mb-2 mt-4 text-xs font-semibold text-emerald-600">새로 열 탭</p>
            <div className="rounded border border-emerald-300 bg-emerald-50 px-2 py-2 text-xs text-emerald-700">
              {pendingTab?.label ?? "-"}
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3">
          <button type="button" onClick={onClose} className="rounded border border-slate-300 px-3 py-1 text-xs">취소</button>
          <button type="button" onClick={onConfirm} className="rounded bg-slate-900 px-3 py-1 text-xs text-white">닫고 열기</button>
        </div>
      </div>
    </div>
  );
}
