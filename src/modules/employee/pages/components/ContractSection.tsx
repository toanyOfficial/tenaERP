"use client";

export function ContractSection(props: {
  contracts: Array<{ id: number; contractStartDate: string; contractEndDate: string | null; writtenDate: string | null; annualSalary: number | null; filePath: string | null }>;
  canViewContract: boolean;
  onUpload: (contractId: number, file: File) => void;
  onDelete: (contractId: number) => void;
}) {
  if (!props.canViewContract) return <p className="text-xs text-slate-500">계약정보는 임원 이상만 조회 가능합니다.</p>;

  return (
    <div className="mt-4 overflow-auto rounded border border-slate-200">
      <table className="w-full table-fixed text-xs">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-2">순번</th><th className="p-2">시작일자</th><th className="p-2">종료일자</th><th className="p-2">작성일자</th><th className="p-2">연봉</th><th className="p-2">파일보기</th><th className="p-2">업로드/삭제</th>
          </tr>
        </thead>
        <tbody>
          {props.contracts.map((c) => (
            <tr key={c.id} className="border-t border-slate-200">
              <td className="p-2 text-center">{c.id}</td><td className="p-2 text-center">{c.contractStartDate}</td><td className="p-2 text-center">{c.contractEndDate ?? "-"}</td><td className="p-2 text-center">{c.writtenDate ?? "-"}</td><td className="p-2 text-right">{c.annualSalary ?? "-"}</td>
              <td className="p-2 text-center">{c.filePath ? <a className="text-blue-600 underline" href={`/${c.filePath}`} target="_blank">보기</a> : "-"}</td>
              <td className="p-2 text-center">
                <input type="file" accept="application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) props.onUpload(c.id, file); e.currentTarget.value = ""; }} />
                <button type="button" className="ml-2 rounded border border-slate-300 px-2 py-1" onClick={() => props.onDelete(c.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
