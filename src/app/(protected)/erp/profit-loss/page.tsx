"use client";

import { useCallback, useState } from "react";
import { OperationBar, SearchBar, SearchField } from "@/components/form";
import { ProfitLossGrid } from "@/modules/profit-loss/pages/components/ProfitLossGrid";
import { ProfitLossSummary } from "@/modules/profit-loss/pages/components/ProfitLossSummary";
import { SalesModal } from "@/modules/profit-loss/pages/components/SalesModal";
import { ExpenseImportModal } from "@/modules/profit-loss/pages/components/ExpenseImportModal";

export default function Page() {
  const [fromYm, setFromYm] = useState("");
  const [toYm, setToYm] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [summary, setSummary] = useState({ total_sales: 0, total_expense: 0, total_profit: 0 });
  const [salesCategory, setSalesCategory] = useState<string | null>(null);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (fromYm) params.set("fromYm", fromYm);
    if (toYm) params.set("toYm", toYm);
    const res = await fetch(`/api/profit-loss?${params.toString()}`);
    const json = await res.json();
    if (!json.success) return;
    setRows(json.data.items ?? []);
    setSummary(json.data.summary ?? { total_sales: 0, total_expense: 0, total_profit: 0 });
  }, [fromYm, toYm]);

  return (
    <section className="flex h-full min-h-0 flex-col gap-2">
      <SearchBar onSearch={() => void load()} onReset={() => { setFromYm(""); setToYm(""); }}>
        <SearchField label="from" htmlFor="fromYm" value={fromYm} onChange={(e)=>setFromYm(e.target.value)} placeholder="YYYYMM" />
        <SearchField label="to" htmlFor="toYm" value={toYm} onChange={(e)=>setToYm(e.target.value)} placeholder="YYYYMM" />
      </SearchBar>

      <OperationBar leftActions={<>
        <button className="h-8 rounded border px-2 text-xs" onClick={()=>setSalesCategory("CONCIERGE")}>매출등록-컨시어지</button>
        <button className="h-8 rounded border px-2 text-xs" onClick={()=>setSalesCategory("TENNER")}>매출등록-테너</button>
        <button className="h-8 rounded border px-2 text-xs" onClick={()=>setSalesCategory("ECHO")}>매출등록-에코</button>
        <button className="h-8 rounded border px-2 text-xs" onClick={()=>setSalesCategory("BOOKING")}>매출등록-부킹</button>
        <button className="h-8 rounded border px-2 text-xs" onClick={()=>setExpenseModalOpen(true)}>파일업로드</button>
      </>} onReset={() => void load()} />

      <ProfitLossSummary {...summary} />
      <ProfitLossGrid rows={rows} />

      <SalesModal open={!!salesCategory} categoryCode={salesCategory ?? ""} onClose={()=>setSalesCategory(null)} onSubmit={async (payload)=>{const res=await fetch('/api/profit-loss/sales/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const j=await res.json();if(j.success){setSalesCategory(null); await load();}}} />
      <ExpenseImportModal open={expenseModalOpen} onClose={()=>setExpenseModalOpen(false)} onCommitted={async()=>{await load();}} />
    </section>
  );
}
