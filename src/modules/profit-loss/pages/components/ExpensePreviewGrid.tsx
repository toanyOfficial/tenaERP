"use client";

export function ExpensePreviewGrid(props: { rows: any[]; selected: number[]; onToggle: (index: number, checked: boolean) => void }) {
  return <div className="max-h-[320px] overflow-auto rounded border border-slate-200"><table className="w-full text-xs"><thead className="bg-slate-50"><tr><th></th><th>rowNo</th><th>targetYm</th><th>amount</th><th>validation</th></tr></thead><tbody>{props.rows.map((row, idx)=><tr key={idx} className="border-t"><td className="p-1 text-center"><input type="checkbox" checked={props.selected.includes(idx)} disabled={!row.importable} onChange={(e)=>props.onToggle(idx,e.target.checked)} /></td><td className="p-1 text-center">{row.rowNo}</td><td className="p-1 text-center">{row.parsedData?.targetYm}</td><td className="p-1 text-right">{row.parsedData?.amount}</td><td className="p-1">{row.validation?.valid?"OK":row.errorMessage}</td></tr>)}</tbody></table></div>;
}
