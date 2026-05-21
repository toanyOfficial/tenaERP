import type { ImportPreviewRow } from "@/components/import/types";

export function PreviewGrid(props: {
  rows: ImportPreviewRow[];
  selected: number[];
  onToggle: (index: number, checked: boolean) => void;
}) {
  return (
    <div className="max-h-[320px] overflow-auto rounded border border-slate-200">
      <table className="w-full text-xs">
        <thead className="bg-slate-50">
          <tr>
            <th></th>
            <th>rowNo</th>
            <th>targetYm</th>
            <th>amount</th>
            <th>validation</th>
          </tr>
        </thead>
        <tbody>
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
                <td className="p-1 text-center">{String(row.parsedData?.targetYm ?? "")}</td>
                <td className="p-1 text-right">{String(row.parsedData?.amount ?? "")}</td>
                <td className={`p-1 ${hasError ? "text-rose-600" : ""}`}>
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
