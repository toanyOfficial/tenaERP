"use client";

export function PasswordMasterGrid(props: { items: any[]; onCreate: () => void; onEdit: (item: any) => void }) {
  return <div className="space-y-2 text-xs"><button className="border px-2 py-1" onClick={props.onCreate}>생성</button><table className="w-full"><thead><tr><th>ID</th><th>TITLE</th><th>AUTH</th><th>USE</th><th>IMMUTABLE</th><th>수정</th></tr></thead><tbody>{props.items.map((i)=><tr key={i.id}><td>{i.id}</td><td>{i.title}</td><td>{i.authorityCode??'-'}</td><td>{i.useYn}</td><td>{i.immutableYn}</td><td><button className="border px-1" onClick={()=>props.onEdit(i)}>수정</button></td></tr>)}</tbody></table></div>;
}
