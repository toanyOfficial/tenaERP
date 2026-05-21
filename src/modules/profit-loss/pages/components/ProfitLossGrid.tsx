"use client";

type Row = { target_ym: string; sales_amount: number; expense_amount: number; profit_amount: number };

export function ProfitLossGrid(props: { rows: Row[] }) {
  return (
    <div className="overflow-auto rounded border border-slate-200 bg-white">
      <table className="w-full table-fixed text-xs">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-2">년월</th>
            <th className="p-2 text-right">매출</th>
            <th className="p-2 text-right">지출</th>
            <th className="p-2 text-right">합계</th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((r) => (
            <tr key={r.target_ym} className="border-t border-slate-200">
              <td className="p-2 text-center">{r.target_ym}</td>
              <td className="p-2 text-right">{r.sales_amount.toLocaleString()}</td>
              <td className="p-2 text-right">{r.expense_amount.toLocaleString()}</td>
              <td className="p-2 text-right font-semibold">{r.profit_amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
