"use client";

import { useState } from "react";
import { Modal } from "@/components/modal";

export function SalesModal(props: { open: boolean; categoryCode: string; onClose: () => void; onSubmit: (payload: any) => Promise<void> }) {
  const [targetYm, setTargetYm] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [amount, setAmount] = useState("0");
  const [memo, setMemo] = useState("");

  if (!props.open) return null;
  return <Modal open={props.open} title={`매출등록(${props.categoryCode})`} onClose={props.onClose} footer={<button className="rounded border px-2 py-1 text-xs" onClick={()=>void props.onSubmit({ targetYm, categoryCode: props.categoryCode, projectCode, amount: Number(amount), memo })}>저장</button>}><div className="space-y-2 text-xs"><input className="w-full border p-1" placeholder="YYYYMM" value={targetYm} onChange={(e)=>setTargetYm(e.target.value)} /><input className="w-full border p-1" placeholder="projectCode" value={projectCode} onChange={(e)=>setProjectCode(e.target.value)} /><input className="w-full border p-1" placeholder="amount" value={amount} onChange={(e)=>setAmount(e.target.value)} /><input className="w-full border p-1" placeholder="memo" value={memo} onChange={(e)=>setMemo(e.target.value)} /></div></Modal>;
}
