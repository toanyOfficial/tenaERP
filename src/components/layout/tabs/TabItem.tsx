"use client";

import type { ERPTab } from "@/types/tab";

type Props = {
  tab: ERPTab;
  active: boolean;
  onClick: () => void;
  onClose?: () => void;
};

export function TabItem({ tab, active, onClick, onClose }: Props) {
  return (
    <div className={`flex items-center gap-2 rounded-t-md border px-3 py-1 text-xs ${active ? "bg-white border-slate-300" : "bg-slate-100 border-slate-200"}`}>
      <button type="button" onClick={onClick} className="text-left">{tab.label}</button>
      {onClose ? <button type="button" onClick={onClose} className="text-slate-500">✕</button> : null}
    </div>
  );
}
