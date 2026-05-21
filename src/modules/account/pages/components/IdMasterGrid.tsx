"use client";

import { useState } from "react";

export function IdMasterGrid(props: { items: any[]; onCreate: (payload: any) => Promise<void>; onUpdate: (payload: any) => Promise<void> }) {
  const [form, setForm] = useState({ title: "", loginId: "", useYn: "Y" });
  return <div className="space-y-2 text-xs"><div className="grid grid-cols-4 gap-1"><input className="border p-1" placeholder="title" value={form.title} onChange={(e)=>setForm((p)=>({...p,title:e.target.value}))}/><input className="border p-1" placeholder="loginId" value={form.loginId} onChange={(e)=>setForm((p)=>({...p,loginId:e.target.value}))}/><select className="border p-1" value={form.useYn} onChange={(e)=>setForm((p)=>({...p,useYn:e.target.value}))}><option>Y</option><option>N</option></select><button className="border" onClick={()=>void props.onCreate(form)}>생성</button></div><table className="w-full"><thead><tr><th>ID</th><th>TITLE</th><th>LOGIN_ID</th><th>USE</th><th>수정</th></tr></thead><tbody>{props.items.map((i)=><tr key={i.id}><td>{i.id}</td><td>{i.title}</td><td>{i.loginId}</td><td>{i.useYn}</td><td><button className="border px-1" onClick={()=>void props.onUpdate({id:i.id,useYn:i.useYn==='Y'?'N':'Y'})}>수정</button></td></tr>)}</tbody></table></div>;
}
