"use client";

import { useCallback, useState } from "react";
import { SearchBar, SearchField } from "@/components/form";

type AccountDetailRow = {
  authorityCode: string | null;
  typeCode: string | null;
  loginTypeCode: string | null;
  loginId: string | null;
  password: string;
  employeeId: number | null;
  isPersonal: boolean;
  visibility: { canDecryptCredential: boolean; canCopyCredential: boolean };
};

type AccountItem = {
  id: number;
  url: string;
  title: string;
  tagsJson: string[] | null;
  details: AccountDetailRow[];
};

export default function Page() {
  const [items, setItems] = useState<AccountItem[]>([]);
  const [search, setSearch] = useState({ tag: "", isPersonal: "ALL" });
  const [visibility, setVisibility] = useState({ canDecryptCredential: false, canCopyCredential: false });

  const load = useCallback(async () => {
    const params = new URLSearchParams(search);
    const res = await fetch(`/api/accounts?${params.toString()}`);
    const json = await res.json();
    if (!json.success) return;
    setItems(json.data.items ?? []);
    setVisibility(json.data.visibility ?? { canDecryptCredential: false, canCopyCredential: false });
  }, [search]);

  return (
    <section className="flex h-full min-h-0 flex-col gap-2">
      <SearchBar onSearch={() => void load()} onReset={() => setSearch({ tag: "", isPersonal: "ALL" })}>
        <SearchField label="태그" htmlFor="tag" value={search.tag} onChange={(e) => setSearch((p) => ({ ...p, tag: e.target.value }))} />
        <SearchField label="개인계정" htmlFor="isPersonal">
          <select id="isPersonal" value={search.isPersonal} onChange={(e) => setSearch((p) => ({ ...p, isPersonal: e.target.value }))} className="h-8 w-full rounded border border-slate-300 px-2 text-xs">
            <option value="ALL">전체</option><option value="Y">개인</option><option value="N">공용</option>
          </select>
        </SearchField>
      </SearchBar>

      <div className="min-h-0 flex-1 overflow-auto rounded border border-slate-200 bg-white p-2">
        {items.map((item) => (
          <article key={item.id} className="mb-2 rounded border border-slate-200 p-2">
            <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold">{item.title}</h3><span className="text-xs text-slate-500">{item.url}</span></div>
            <div className="text-xs text-slate-500">태그: {(item.tagsJson ?? []).join(", ") || "-"}</div>
            <table className="mt-2 w-full table-fixed text-xs">
              <thead className="bg-slate-50"><tr><th>권한</th><th>종류</th><th>로그인타입</th><th>아이디</th><th>비밀번호</th><th>개인계정</th><th>복사</th></tr></thead>
              <tbody>
                {item.details.map((d, idx) => (
                  <tr key={`${item.id}-${idx}`} className="border-t border-slate-200 text-center">
                    <td>{d.authorityCode ?? "-"}</td><td>{d.typeCode ?? "-"}</td><td>{d.loginTypeCode ?? "-"}</td><td>{d.loginId ?? "-"}</td><td>{d.password}</td><td>{d.isPersonal ? "Y" : "N"}</td>
                    <td>{visibility.canCopyCredential ? <button type="button" className="rounded border border-slate-300 px-2" onClick={() => navigator.clipboard.writeText(d.loginId ?? "")}>복사</button> : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ))}
      </div>
    </section>
  );
}
