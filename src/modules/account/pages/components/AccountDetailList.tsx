"use client";

import type { AccountDetailItem } from "@/modules/account/pages/components/types";
import { CredentialField } from "@/modules/account/pages/components/CredentialField";

const TYPE_LABELS: Record<string, string> = { "1": "사업자", "2": "대표이사", "3": "개인" };
const LOGIN_TYPE_LABELS: Record<string, string> = { "1": "아이디비밀번호", "2": "공동인증서", "3": "휴대폰인증", "4": "gmailSSO", "5": "카카오톡SSO", "6": "네이버SSO" };
const SOURCE_LABELS: Record<string, string> = { "1": "직접입력", "2": "마스터" };

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
              <td className="p-1 text-center">{d.authorityLabel ?? d.authorityCode ?? "-"}</td>
              <td className="p-1 text-center">{d.typeLabel ?? (d.typeCode ? (TYPE_LABELS[d.typeCode] ?? d.typeCode) : "-")}</td>
              <td className="p-1 text-center">{d.loginTypeLabel ?? (d.loginTypeCode ? (LOGIN_TYPE_LABELS[d.loginTypeCode] ?? d.loginTypeCode) : "-")}</td>
              <td className="p-1"><CredentialField value={d.loginId ?? ""} canCopy={props.copyEnabled} /></td>
              <td className="p-1"><CredentialField value={d.password} canCopy={false} /></td>
              <td className="p-1 text-center">ID:{d.idSourceLabel ?? SOURCE_LABELS[d.idSourceType]} / PW:{d.passwordSourceLabel ?? SOURCE_LABELS[d.passwordSourceType]}</td>
              <td className="p-1 text-center">{d.employeeId ? `개인(${d.employeeId})` : "공용"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
