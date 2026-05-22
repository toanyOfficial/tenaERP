"use client";

import type { EmployeeDetail } from "@/modules/employee/pages/components/types";

export function ContractSection(props: {
  contracts: EmployeeDetail["contracts"];
  canViewContract: boolean;
  canEditContract: boolean;
  onContractsChange: (contracts: EmployeeDetail["contracts"]) => void;
  onUpload: (contractId: number, file: File) => void;
  onDelete: (contractId: number) => void;
}) {
  if (!props.canViewContract) return <p className="text-xs text-slate-500">계약정보는 임원 이상만 조회 가능합니다.</p>;

  const today = new Date().toISOString().slice(0, 10);

  const addContract = () => {
    if (!props.canEditContract) return;
    props.onContractsChange([
      ...props.contracts,
      {
        id: -Date.now(),
        writtenDate: today,
        contractStartDate: "",
        contractEndDate: null,
        annualSalary: null,
        filePath: null,
        isNew: true,
      },
    ]);
  };

  const updateContract = (id: number, key: "writtenDate" | "contractStartDate" | "contractEndDate" | "annualSalary", value: string) => {
    props.onContractsChange(
      props.contracts.map((contract) => {
        if (contract.id !== id) return contract;
        if (key === "annualSalary") {
          return { ...contract, annualSalary: value ? Number(value) : null };
        }
        return { ...contract, [key]: value || null };
      }),
    );
  };

  const removeNewContract = (id: number) => {
    props.onContractsChange(props.contracts.filter((contract) => contract.id !== id));
  };

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-700">계약정보</p>
        {props.canEditContract ? (
          <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={addContract}>
            계약 추가
          </button>
        ) : null}
      </div>
      <div className="overflow-auto rounded border border-slate-200">
      <table className="w-full table-fixed text-xs">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-2">순번</th><th className="p-2">시작일자</th><th className="p-2">종료일자</th><th className="p-2">작성일자</th><th className="p-2">연봉</th><th className="p-2">파일보기</th><th className="p-2">업로드/삭제</th>
          </tr>
        </thead>
        <tbody>
          {props.contracts.map((c, index) => (
            <tr key={c.id} className="border-t border-slate-200">
              <td className="p-2 text-center">{c.isNew ? `신규 ${index + 1}` : c.id}</td>
              <td className="p-2 text-center">{c.isNew ? <input type="date" className="h-7 w-full rounded border border-slate-300 px-1" value={c.contractStartDate} onChange={(e) => updateContract(c.id, "contractStartDate", e.target.value)} /> : c.contractStartDate}</td>
              <td className="p-2 text-center">{c.isNew ? <input type="date" className="h-7 w-full rounded border border-slate-300 px-1" value={c.contractEndDate ?? ""} onChange={(e) => updateContract(c.id, "contractEndDate", e.target.value)} /> : (c.contractEndDate ?? "-")}</td>
              <td className="p-2 text-center">{c.isNew ? <input type="date" className="h-7 w-full rounded border border-slate-300 px-1" value={c.writtenDate ?? ""} onChange={(e) => updateContract(c.id, "writtenDate", e.target.value)} /> : (c.writtenDate ?? "-")}</td>
              <td className="p-2 text-right">{c.isNew ? <input type="number" className="h-7 w-full rounded border border-slate-300 px-1 text-right" value={c.annualSalary ?? ""} onChange={(e) => updateContract(c.id, "annualSalary", e.target.value)} /> : (c.annualSalary ?? "-")}</td>
              <td className="p-2 text-center">{c.filePath ? <a className="text-blue-600 underline" href={`/${c.filePath}`} target="_blank">보기</a> : "-"}</td>
              <td className="p-2 text-center">
                {!c.isNew ? <input type="file" accept="application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) props.onUpload(c.id, file); e.currentTarget.value = ""; }} /> : null}
                {c.isNew ? (
                  <button type="button" className="rounded border border-slate-300 px-2 py-1" onClick={() => removeNewContract(c.id)}>삭제</button>
                ) : (
                  <button type="button" className="ml-2 rounded border border-slate-300 px-2 py-1" onClick={() => props.onDelete(c.id)}>삭제</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
