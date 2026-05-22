"use client";

import { useEffect, useMemo, useState } from "react";
import { FormField, Input, OperationButton } from "@/components/form";
import { Modal } from "@/components/modal";
import type { AccountDetailItem, AccountItem, CredentialSourceType, IdMasterOption, PasswordMasterOption } from "@/modules/account/pages/components/types";

type DetailForm = {
  id?: number;
  authorityCode: string;
  typeCode: string;
  loginTypeCode: string;
  idSourceType: CredentialSourceType;
  idMasterId: number | null;
  loginId: string;
  passwordSourceType: CredentialSourceType;
  passwordMasterId: number | null;
  password: string;
  employeeId: number | null;
};

const toDetailForm = (d?: AccountDetailItem): DetailForm => ({
  id: d?.id,
  authorityCode: d?.authorityCode ?? "",
  typeCode: d?.typeCode ?? "",
  loginTypeCode: d?.loginTypeCode ?? "",
  idSourceType: d?.idSourceType ?? "MANUAL",
  idMasterId: d?.idMasterId ?? null,
  loginId: d?.loginId ?? "",
  passwordSourceType: d?.passwordSourceType ?? "MANUAL",
  passwordMasterId: d?.passwordMasterId ?? null,
  password: "",
  employeeId: d?.employeeId ?? null,
});

export function AccountModal(props: { open: boolean; item: AccountItem | null; idMasters: IdMasterOption[]; passwordMasters: PasswordMasterOption[]; onClose: () => void; onSubmit: (payload: any) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [details, setDetails] = useState<DetailForm[]>([toDetailForm()]);

  useEffect(() => {
    if (!props.open) return;
    setTitle(props.item?.title ?? "");
    setUrl(props.item?.url ?? "");
    setTags((props.item?.tagsJson ?? []).join(","));
    setDetails(props.item?.details?.length ? props.item.details.map((d) => toDetailForm(d)) : [toDetailForm()]);
  }, [props.open, props.item]);

  const idMasterMap = useMemo(() => new Map(props.idMasters.map((m) => [m.id, m])), [props.idMasters]);

  const updateDetail = (index: number, patch: Partial<DetailForm>) => {
    setDetails((prev) => prev.map((d, i) => {
      if (i !== index) return d;
      const next = { ...d, ...patch };
      if (patch.idSourceType === "MANUAL") next.idMasterId = null;
      if (patch.passwordSourceType === "MANUAL") next.passwordMasterId = null;
      if (patch.passwordSourceType === "MASTER") next.password = "";
      return next;
    }));
  };

  if (!props.open) return null;

  return (
    <Modal open={props.open} title={props.item ? "계정 수정" : "계정 신규"} onClose={props.onClose} size="medium" footer={<div className="flex justify-end gap-2"><OperationButton label="취소" onClick={props.onClose} /><OperationButton label="저장" variant="primary" onClick={() => void props.onSubmit({
      title,
      url,
      tagsJson: tags.split(",").map((v) => v.trim()).filter(Boolean),
      details: details.map((d) => ({
        ...(d.id ? { id: d.id } : {}),
        authorityCode: d.authorityCode || undefined,
        typeCode: d.typeCode || undefined,
        loginTypeCode: d.loginTypeCode || undefined,
        idSourceType: d.idSourceType,
        idMasterId: d.idSourceType === "MASTER" ? d.idMasterId : null,
        loginId: d.idSourceType === "MANUAL" ? d.loginId : "",
        passwordSourceType: d.passwordSourceType,
        passwordMasterId: d.passwordSourceType === "MASTER" ? d.passwordMasterId : null,
        password: d.passwordSourceType === "MANUAL" ? d.password : "",
        employeeId: d.employeeId,
      })),
    })} /></div>}>
      <div className="space-y-2">
        <FormField label="제목" htmlFor="a-title"><Input id="a-title" value={title} onChange={(e) => setTitle(e.target.value)} /></FormField>
        <FormField label="URL" htmlFor="a-url"><Input id="a-url" value={url} onChange={(e) => setUrl(e.target.value)} /></FormField>
        <FormField label="태그" htmlFor="a-tags"><Input id="a-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="콤마로 구분" /></FormField>

        {details.map((detail, index) => (
          <div key={index} className="rounded border border-slate-200 p-2 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <FormField label="아이디 입력 방식" htmlFor={`id-source-${index}`}>
                <select id={`id-source-${index}`} value={detail.idSourceType} onChange={(e) => updateDetail(index, { idSourceType: e.target.value as CredentialSourceType })} className="h-8 w-full rounded border border-slate-300 px-2 text-xs">
                  <option value="MANUAL">직접입력</option>
                  <option value="MASTER">마스터선택</option>
                </select>
              </FormField>
              <FormField label="비밀번호 입력 방식" htmlFor={`pw-source-${index}`}>
                <select id={`pw-source-${index}`} value={detail.passwordSourceType} onChange={(e) => updateDetail(index, { passwordSourceType: e.target.value as CredentialSourceType })} className="h-8 w-full rounded border border-slate-300 px-2 text-xs">
                  <option value="MANUAL">직접입력</option>
                  <option value="MASTER">마스터선택</option>
                </select>
              </FormField>
            </div>

            {detail.idSourceType === "MANUAL" ? (
              <FormField label="로그인 ID" htmlFor={`login-id-${index}`}><Input id={`login-id-${index}`} value={detail.loginId} onChange={(e) => updateDetail(index, { loginId: e.target.value })} /></FormField>
            ) : (
              <FormField label="ID 마스터" htmlFor={`id-master-${index}`}>
                <select id={`id-master-${index}`} value={detail.idMasterId ?? ""} onChange={(e) => updateDetail(index, { idMasterId: e.target.value ? Number(e.target.value) : null })} className="h-8 w-full rounded border border-slate-300 px-2 text-xs">
                  <option value="">선택</option>
                  {props.idMasters.map((m) => <option key={m.id} value={m.id}>{m.title} ({m.loginId})</option>)}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">선택된 ID: {detail.idMasterId ? (idMasterMap.get(detail.idMasterId)?.loginId ?? "-") : "-"}</p>
              </FormField>
            )}

            {detail.passwordSourceType === "MANUAL" ? (
              <FormField label="비밀번호" htmlFor={`password-${index}`}><Input id={`password-${index}`} type="password" value={detail.password} onChange={(e) => updateDetail(index, { password: e.target.value })} placeholder={props.item ? "변경 시에만 입력" : ""} /></FormField>
            ) : (
              <FormField label="PW 마스터" htmlFor={`pw-master-${index}`}>
                <select id={`pw-master-${index}`} value={detail.passwordMasterId ?? ""} onChange={(e) => updateDetail(index, { passwordMasterId: e.target.value ? Number(e.target.value) : null })} className="h-8 w-full rounded border border-slate-300 px-2 text-xs">
                  <option value="">선택</option>
                  {props.passwordMasters.map((m) => <option key={m.id} value={m.id}>{m.title}{m.authorityCode ? ` (${m.authorityCode})` : ""}</option>)}
                </select>
              </FormField>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
