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
  const [searchError, setSearchError] = useState<string | null>(null);
  const [search, setSearch] = useState({ name: "", employeeNo: "", phone: "", birthDate: "", employmentStatus: "ALL" });
  const [selected, setSelected] = useState<EmployeeListRow | null>(null);
  const [detail, setDetail] = useState<EmployeeDetail | null>(null);
  const [canViewContract, setCanViewContract] = useState(false);
  const [canEditSensitive, setCanEditSensitive] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearchError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(search).forEach(([key, value]) => {
        if (!value) return;
        if (key === "employmentStatus" && value === "ALL") return;
        params.set(key, value);
      });

      const query = params.toString();
      const res = await fetch(`/api/employees${query ? `?${query}` : ""}`);
      const json = await res.json();

      if (!json.success) {
        if (json.errorCode === "VALIDATION_ERROR") {
          setSearchError(json.message ?? "검색 조건을 확인해주세요.");
          setError(null);
        } else {
          setError(json.message ?? "조회 실패");
        }
        return;
      }

      setRows(json.data.items);
    } catch {
      setError("조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      const canViewContract = Boolean(json?.data?.visibility?.canViewContract);
      setCanViewContract(canViewContract);
      setCanEditSensitive(canViewContract);
    })();
  }, []);

  const handleSearch = useCallback(() => {
    void load();
  }, [load]);

  async function openDetail(row: EmployeeListRow) {
    setSelected(row);
    const res = await fetch(`/api/employees/${row.id}`);
    if (!res.ok) {
      setDetail(null);
      return;
    }
    const json = await res.json();
    setDetail(json.success ? json.data : null);
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-2">
      <SearchBar onSearch={handleSearch} onReset={() => setSearch({ name: "", employeeNo: "", phone: "", birthDate: "", employmentStatus: "ALL" })}>
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

      {searchError ? <p className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">{searchError}</p> : null}

      <OperationBar leftActions={<DefaultOperationActions onCreate={() => { setSelected({ id: 0, employeeNo: "", name: "신규", nickname: null, birthDate: null, phone: null, email: null, bankName: null, bankAccountNo: null, address: null, employmentStatus: "EMPLOYED", updatedAt: new Date().toISOString() }); setDetail(null); }} />} onReset={handleSearch} />

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
                    const isCreate = !detail?.employee.id;
          const res = await fetch(isCreate ? `/api/employees/create` : `/api/employees/${detail.employee.id}/update`, { method: isCreate ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
