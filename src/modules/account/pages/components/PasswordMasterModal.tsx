"use client";

import { useState } from "react";
import { Modal } from "@/components/modal";

export function PasswordMasterModal(props: { open: boolean; item: any; onClose: ()=>void; onSubmit: (payload:any)=>Promise<void> }) {
  const [title, setTitle] = useState(props.item?.title ?? "");
  const [password, setPassword] = useState("");
  const [authorityCode, setAuthorityCode] = useState(props.item?.authorityCode ?? "");
  const [useYn, setUseYn] = useState(props.item?.useYn ?? "Y");
  if (!props.open) return null;
  return <Modal open={props.open} title="비밀번호마스터" onClose={props.onClose} footer={<button className="border px-2 py-1" onClick={()=>void props.onSubmit({id:props.item?.id,title,password,authorityCode,useYn})}>저장</button>}><div className="space-y-2 text-xs"><input className="w-full border p-1" placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)}/><input className="w-full border p-1" placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/><input className="w-full border p-1" placeholder="authorityCode" value={authorityCode} onChange={(e)=>setAuthorityCode(e.target.value)}/><select className="w-full border p-1" value={useYn} onChange={(e)=>setUseYn(e.target.value)}><option>Y</option><option>N</option></select>{props.item?.immutableYn==='Y'&&props.item?.useYn==='Y'?<p className="text-rose-600">사용중 immutable 마스터는 수정 제한됩니다.</p>:null}</div></Modal>;
}
