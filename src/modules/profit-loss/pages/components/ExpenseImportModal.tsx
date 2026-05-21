"use client";

import { useState } from "react";
import { Modal } from "@/components/modal";
import { ExpensePreviewGrid } from "@/modules/profit-loss/pages/components/ExpensePreviewGrid";

export function ExpenseImportModal(props: { open: boolean; onClose: () => void; onCommitted: () => Promise<void> }) {
  const [rows, setRows] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  async function handleUpload(file: File) {
    const form = new FormData(); form.set("file", file);
    const res = await fetch("/api/profit-loss/expense/preview", { method: "POST", body: form });
    const json = await res.json();
    if (!json.success) return;
    setRows(json.data.items ?? []);
    setSelected((json.data.items ?? []).map((_: any, i: number) => i).filter((i:number)=>json.data.items[i].importable));
  }

  async function handleCommit() {
    const commitRows = selected.map((i)=>rows[i].parsedData);
    const res = await fetch("/api/profit-loss/expense/commit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ batchGroup: "EXPENSE_IMPORT", batchSeq: Date.now(), title: "expense import", rows: commitRows })});
    const json = await res.json();
    if (json.success) { await props.onCommitted(); props.onClose(); }
  }

  if (!props.open) return null;
  return <Modal open={props.open} title="지출 업로드" onClose={props.onClose} size="large" footer={<button className="rounded border px-2 py-1 text-xs" onClick={()=>void handleCommit()}>Import Commit</button>}><div className="space-y-2"><input type="file" accept=".csv,text/csv" onChange={(e)=>{const f=e.target.files?.[0]; if(f) void handleUpload(f);}} /><ExpensePreviewGrid rows={rows} selected={selected} onToggle={(index,checked)=>setSelected((prev)=>checked?[...prev,index]:prev.filter((v)=>v!==index))} /></div></Modal>;
}
