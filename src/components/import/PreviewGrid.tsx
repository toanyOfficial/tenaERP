import type { ImportPreviewRow } from "@/components/import/types";

export function PreviewGrid(props: {
  rows: ImportPreviewRow[];
  selected: number[];
  onToggle: (index: number, checked: boolean) => void;
  loading?: boolean;
  errorMessage?: string | null;
}) {
  const colSpan = 5;

  return (
    <div className="max-h-[320px] overflow-auto rounded border border-slate-200 bg-white">
      <table className="w-full table-fixed text-xs">
        <thead className="sticky top-0 bg-slate-50">
          <tr>
            <th className="w-10 p-1"></th>
            <th className="w-16 p-1">rowNo</th>
            <th className="p-1">targetYm</th>
            <th className="w-24 p-1 text-right">amount</th>
            <th className="w-48 p-1">validation</th>
          </tr>
        </thead>
        <tbody>
          {props.errorMessage ? (
            <tr className="border-t">
              <td colSpan={colSpan} className="h-10 px-2 text-rose-600">{props.errorMessage}</td>
            </tr>
          ) : null}
          {props.loading ? (
            <tr className="border-t">
              <td colSpan={colSpan} className="h-10 px-2 text-slate-500">로딩 중...</td>
            </tr>
          ) : null}
          {!props.loading && !props.errorMessage && props.rows.length === 0 ? (
            <tr className="border-t">
              <td colSpan={colSpan} className="h-10 px-2 text-slate-500">표시할 데이터가 없습니다.</td>
            </tr>
          ) : null}
          {props.rows.map((row, idx) => {
            const importable = row.importable ?? row.valid;
            const hasError = !importable;

            return (
              <tr key={idx} className={`border-t ${hasError ? "bg-rose-50" : ""}`}>
                <td className="p-1 text-center">
                  <input
                    type="checkbox"
                    checked={props.selected.includes(idx)}
                    disabled={!importable}
                    onChange={(e) => props.onToggle(idx, e.target.checked)}
                  />
                </td>
                <td className="p-1 text-center">{row.rowNo}</td>
                <td className="truncate p-1 text-center">{String(row.parsedData?.targetYm ?? "")}</td>
                <td className="p-1 text-right">{String(row.parsedData?.amount ?? "")}</td>
                <td className={`truncate p-1 ${hasError ? "text-rose-600" : ""}`}>
                  {importable ? "OK" : row.errorMessage ?? row.errors[0] ?? "검증 오류"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
