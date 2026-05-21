"use client";

export function ProfitLossSummary(props: { total_sales: number; total_expense: number; total_profit: number }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded border border-slate-200 bg-white p-2 text-xs">총 매출: <b>{props.total_sales.toLocaleString()}</b></div>
      <div className="rounded border border-slate-200 bg-white p-2 text-xs">총 지출: <b>{props.total_expense.toLocaleString()}</b></div>
      <div className="rounded border border-slate-200 bg-white p-2 text-xs">총 합계: <b>{props.total_profit.toLocaleString()}</b></div>
    </div>
  );
}
