import { queryMonthlyExpense, queryMonthlySales } from "@/modules/profit-loss/queries/profit-loss";

function buildYmRange(fromYm: string, toYm: string) {
  const result: string[] = [];
  let cursor = fromYm;
  while (cursor <= toYm) {
    result.push(cursor);
    const y = Number(cursor.slice(0, 4));
    const m = Number(cursor.slice(4, 6));
    const d = new Date(Date.UTC(y, m, 1));
    cursor = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  }
  return result;
}

type MonthlyRow = { targetYm: string; amount: number | string | null };

export async function getProfitLossSummaryService(params: { fromYm: string; toYm: string }) {
  const [salesRowsRaw, expenseRowsRaw] = await Promise.all([
    queryMonthlySales(params.fromYm, params.toYm),
    queryMonthlyExpense(params.fromYm, params.toYm),
  ]);

  const salesRows = salesRowsRaw as MonthlyRow[];
  const expenseRows = expenseRowsRaw as MonthlyRow[];

  const salesMap = new Map<string, number>(salesRows.map((row) => [row.targetYm, Number(row.amount ?? 0)]));
  const expenseMap = new Map<string, number>(expenseRows.map((row) => [row.targetYm, Number(row.amount ?? 0)]));

  const months = buildYmRange(params.fromYm, params.toYm);
  const items = months.map((targetYm) => {
    const salesAmount = salesMap.get(targetYm) ?? 0;
    const expenseAmount = expenseMap.get(targetYm) ?? 0;
    const profitAmount = salesAmount - expenseAmount;
    return { target_ym: targetYm, sales_amount: salesAmount, expense_amount: expenseAmount, profit_amount: profitAmount };
  });

  const total_sales = items.reduce((sum, item) => sum + Number(item.sales_amount), 0);
  const total_expense = items.reduce((sum, item) => sum + Number(item.expense_amount), 0);
  const total_profit = total_sales - total_expense;

  return { items, summary: { total_sales, total_expense, total_profit } };
}
