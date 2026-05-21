"use client";

import { useCallback, useState } from "react";
import { OperationButton } from "@/components/form";
import { IdMasterGrid } from "@/modules/account/pages/components/IdMasterGrid";
import { PasswordMasterGrid } from "@/modules/account/pages/components/PasswordMasterGrid";
import { PasswordMasterModal } from "@/modules/account/pages/components/PasswordMasterModal";

export function AccountMasterPage() {
  const [data, setData] = useState<{ idMasters: any[]; passwordMasters: any[] }>({ idMasters: [], passwordMasters: [] });
  const [editingPassword, setEditingPassword] = useState<any | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/account-master');
    const json = await res.json();
    if (json.success) setData(json.data);
  }, []);

  return (
    <section className="grid h-full min-h-0 grid-cols-2 gap-2">
      <div className="min-h-0 rounded border border-slate-200 bg-white p-2">
        <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold">아이디마스터</h3><OperationButton label="새로고침" onClick={() => void load()} /></div>
        <IdMasterGrid items={data.idMasters} onCreate={async (payload)=>{await fetch('/api/account-master/id',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); await load();}} onUpdate={async(payload)=>{await fetch('/api/account-master/id',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); await load();}} />
      </div>
      <div className="min-h-0 rounded border border-slate-200 bg-white p-2">
        <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold">비밀번호마스터</h3><OperationButton label="새로고침" onClick={() => void load()} /></div>
        <PasswordMasterGrid items={data.passwordMasters} onCreate={() => setEditingPassword({})} onEdit={(item) => setEditingPassword(item)} />
      </div>
      <PasswordMasterModal open={!!editingPassword} item={editingPassword} onClose={() => setEditingPassword(null)} onSubmit={async (payload)=>{await fetch('/api/account-master/password',{method: payload.id ? 'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); setEditingPassword(null); await load();}} />
    </section>
  );
}
