"use client";

import { AccountDetailList } from "@/modules/account/pages/components/AccountDetailList";
import type { AccountItem } from "@/modules/account/pages/components/types";

export function AccountCard(props: { item: AccountItem; copyEnabled: boolean; onEdit: () => void }) {
  return (
    <article className="rounded border border-slate-300 bg-white p-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{props.item.title}</h3>
        <button type="button" className="h-7 rounded border border-slate-300 px-2 text-xs" onClick={props.onEdit}>수정</button>
      </div>
      <p className="truncate text-xs text-slate-500">{props.item.url}</p>
      <p className="truncate text-xs text-slate-500">태그: {(props.item.tagsJson ?? []).join(", ") || "-"}</p>
      <AccountDetailList details={props.item.details} copyEnabled={props.copyEnabled} />
    </article>
  );
}
