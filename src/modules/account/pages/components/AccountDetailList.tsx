"use client";

import { CredentialField } from "@/modules/account/pages/components/CredentialField";
import type { AccountDetailItem } from "@/modules/account/pages/components/types";

const sourceLabel = (v: "MANUAL" | "MASTER") => (v === "MASTER" ? "마스터" : "직접입력");

export function AccountDetailList(props: { details: AccountDetailItem[]; copyEnabled: boolean }) {
  return (
    <div className="mt-2 overflow-auto rounded border border-slate-200">
      <table className="w-full table-fixed text-xs">
        <thead className="bg-slate-50">
          <tr><th>권한</th><th>종류</th><th>로그인타입</th><th>ID</th><th>PW</th><th>출처</th><th>기타</th></tr>
        </thead>
        <tbody>
          {props.details.map((d, i) => (
            <tr key={i} className={`border-t border-slate-200 ${d.isPersonal ? "bg-amber-50/50" : ""}`}>
              <td className="p-1 text-center">{d.authorityCode ?? "-"}</td>
              <td className="p-1 text-center">{d.typeCode ?? "-"}</td>
              <td className="p-1 text-center">{d.loginTypeCode ?? "-"}</td>
              <td className="p-1"><CredentialField value={d.loginId ?? ""} canCopy={props.copyEnabled} /></td>
              <td className="p-1"><CredentialField value={d.password} canCopy={false} /></td>
              <td className="p-1 text-center">ID:{sourceLabel(d.idSourceType)} / PW:{sourceLabel(d.passwordSourceType)}</td>
              <td className="p-1 text-center">{d.employeeId ? `개인(${d.employeeId})` : "공용"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
