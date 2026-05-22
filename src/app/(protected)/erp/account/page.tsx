"use client";

import { useCallback, useEffect, useState } from "react";
import { DefaultOperationActions, OperationBar, SearchBar, SearchField } from "@/components/form";
import { AccountCard } from "@/modules/account/pages/components/AccountCard";
import { AccountModal } from "@/modules/account/pages/components/AccountModal";
import type { AccountItem, IdMasterOption, PasswordMasterOption } from "@/modules/account/pages/components/types";

export default function Page() {
  const [items, setItems] = useState<AccountItem[]>([]);
  const [search, setSearch] = useState({ tag: "", isPersonal: "ALL" });
  const [copyEnabled, setCopyEnabled] = useState(false);
  const [editing, setEditing] = useState<AccountItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [idMasters, setIdMasters] = useState<IdMasterOption[]>([]);
  const [passwordMasters, setPasswordMasters] = useState<PasswordMasterOption[]>([]);

  const load = useCallback(async () => {
    const params = new URLSearchParams(search);
    const res = await fetch(`/api/accounts?${params.toString()}`);
    const json = await res.json();
    if (!json.success) return;
    setItems(json.data.items ?? []);
    setCopyEnabled(Boolean(json.data.visibility?.canCopyCredential));
  }, [search]);

  const loadMasters = useCallback(async () => {
    try {
      const [idRes, pwRes] = await Promise.all([fetch('/api/account-master/id'), fetch('/api/account-master/password')]);
      const [idJson, pwJson] = await Promise.all([idRes.json(), pwRes.json()]);
      if (idJson.success) setIdMasters((idJson.data ?? []).filter((v: IdMasterOption) => v.useYn === 'Y'));
      if (pwJson.success) setPasswordMasters((pwJson.data ?? []).filter((v: PasswordMasterOption) => v.useYn === 'Y'));
    } catch {
      setIdMasters([]);
      setPasswordMasters([]);
    }
  }, []);

  useEffect(() => { void loadMasters(); }, [loadMasters]);

  return (
    <section className="flex h-full min-h-0 flex-col gap-2">
      <SearchBar onSearch={() => void load()} onReset={() => setSearch({ tag: "", isPersonal: "ALL" })}>
        <SearchField label="태그" htmlFor="s-tag" value={search.tag} onChange={(e) => setSearch((p) => ({ ...p, tag: e.target.value }))} />
        <SearchField label="개인계정" htmlFor="s-personal">
          <select id="s-personal" value={search.isPersonal} onChange={(e) => setSearch((p) => ({ ...p, isPersonal: e.target.value }))} className="h-8 w-full rounded border border-slate-300 px-2 text-xs">
            <option value="ALL">전체</option><option value="Y">개인</option><option value="N">공용</option>
          </select>
        </SearchField>
      </SearchBar>

      <OperationBar leftActions={<DefaultOperationActions onCreate={() => setCreateOpen(true)} />} onReset={() => void load()} />

      <div className="min-h-0 flex-1 space-y-2 overflow-auto">
        {items.map((item) => <AccountCard key={item.id} item={item} copyEnabled={copyEnabled} onEdit={() => setEditing(item)} />)}
      </div>

      <AccountModal
        open={createOpen}
        item={null}
        idMasters={idMasters}
        passwordMasters={passwordMasters}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (payload) => {
          const res = await fetch('/api/accounts/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const json = await res.json();
          if (json.success) { setCreateOpen(false); await load(); }
        }}
      />
      <AccountModal
        open={!!editing}
        item={editing}
        idMasters={idMasters}
        passwordMasters={passwordMasters}
        onClose={() => setEditing(null)}
        onSubmit={async (payload) => {
          if (!editing) return;
          const res = await fetch(`/api/accounts/${editing.id}/update`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const json = await res.json();
          if (json.success) { setEditing(null); await load(); }
        }}
      />
    </section>
  );
}
