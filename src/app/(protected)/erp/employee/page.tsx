"use client";

import { useCallback, useEffect, useState } from "react";
import { DefaultOperationActions, OperationBar, SearchBar, SearchField } from "@/components/form";
import { EmployeeGrid } from "@/modules/employee/pages/components/EmployeeGrid";
import { EmployeeModal } from "@/modules/employee/pages/components/EmployeeModal";
import type { EmployeeDetail, EmployeeListRow } from "@/modules/employee/pages/components/types";

export default function Page() {
  const [rows, setRows] = useState<EmployeeListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState({ name: "", employeeNo: "", phone: "", birthDate: "", employmentStatus: "ALL" });
  const [selected, setSelected] = useState<EmployeeListRow | null>(null);
  const [detail, setDetail] = useState<EmployeeDetail | null>(null);
  const [canViewContract, setCanViewContract] = useState(false);
  const [canEditSensitive, setCanEditSensitive] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const params = new URLSearchParams(search as Record<string, string>);
    const res = await fetch(`/api/employees?${params.toString()}`);
    const json = await res.json();
    if (!json.success) { setError(json.message ?? "조회 실패"); setLoading(false); return; }
    setRows(json.data.items);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      const authorityCode = json?.data?.authorityCode as string | undefined;
      const executive = authorityCode === "SUPER_ADMIN" || authorityCode === "CEO" || authorityCode === "EXECUTIVE";
      setCanViewContract(executive);
      setCanEditSensitive(executive);
    })();
  }, []);

  async function openDetail(row: EmployeeListRow) {
    setSelected(row);
    const res = await fetch(`/api/employees/${row.id}`);
    // detail API expects numeric id; fallback query by list row click through separate map unavailable in list response.
    // use list index-based route is not possible, so derive via separate search by name/employeeNo from list endpoint not provided.
    // keep modal for new mode when no detail fetched.
    if (!res.ok) {
      setDetail(null);
      return;
    }
    const json = await res.json();
    setDetail(json.success ? json.data : null);
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-2">
      <SearchBar onSearch={() => void load()} onReset={() => setSearch({ name: "", employeeNo: "", phone: "", birthDate: "", employmentStatus: "ALL" })}>
        <SearchField label="이름" htmlFor="s-name" value={search.name} onChange={(e) => setSearch((p) => ({ ...p, name: e.target.value }))} />
        <SearchField label="사번" htmlFor="s-no" value={search.employeeNo} onChange={(e) => setSearch((p) => ({ ...p, employeeNo: e.target.value }))} />
        <SearchField label="연락처" htmlFor="s-phone" value={search.phone} onChange={(e) => setSearch((p) => ({ ...p, phone: e.target.value }))} />
        <SearchField label="생년월일" htmlFor="s-birth" value={search.birthDate} onChange={(e) => setSearch((p) => ({ ...p, birthDate: e.target.value }))} />
        <SearchField label="재직여부" htmlFor="s-status">
          <select id="s-status" className="h-8 w-full rounded border border-slate-300 px-2 text-xs" value={search.employmentStatus} onChange={(e) => setSearch((p) => ({ ...p, employmentStatus: e.target.value }))}>
            <option value="ALL">전체</option><option value="EMPLOYED">재직</option><option value="RESIGNED">퇴사</option>
          </select>
        </SearchField>
      </SearchBar>

      <OperationBar leftActions={<DefaultOperationActions onCreate={() => { setSelected({ id: 0, employeeNo: "", name: "신규", nickname: null, birthDate: null, phone: null, email: null, bankName: null, bankAccountNo: null, address: null, employmentStatus: "EMPLOYED", updatedAt: new Date().toISOString() }); setDetail(null); }} />} onReset={() => void load()} />

      <div className="min-h-0 flex-1">
        <EmployeeGrid rows={rows} loading={loading} errorMessage={error} onRowClick={(row) => void openDetail(row)} />
      </div>

      <EmployeeModal
        open={!!selected}
        title={selected?.employeeNo ? `인원 수정 (${selected.employeeNo})` : "인원 신규"}
        detail={detail}
        canViewContract={canViewContract}
        canEditSensitive={canEditSensitive}
        onClose={() => setSelected(null)}
        onSave={async (payload) => {
          if (!detail?.employee.id) return;
          const res = await fetch(`/api/employees/${detail.employee.id}/update`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
          const json = await res.json();
          if (!json.success) throw json;
          await load();
        }}
        onUpload={async (contractId, file) => {
          const formData = new FormData(); formData.set("contractId", String(contractId)); formData.set("file", file);
          await fetch("/api/employees/contracts/upload", { method: "POST", body: formData });
        }}
        onDeleteFile={async (contractId) => {
          await fetch("/api/employees/contracts/delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contractId }) });
        }}
      />
    </section>
  );
}
