"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";
import { EmployeeForm, type EmployeeFormState } from "@/modules/employee/pages/components/EmployeeForm";
import { ContractSection } from "@/modules/employee/pages/components/ContractSection";
import type { EmployeeDetail } from "@/modules/employee/pages/components/types";

function toForm(detail: EmployeeDetail | null): EmployeeFormState {
  return {
    phone: detail?.employee.phone ?? "",
    email: detail?.employee.email ?? "",
    address: detail?.employee.address ?? "",
    bankName: detail?.employee.bankName ?? "",
    bankAccountNo: detail?.employee.bankAccountNo ?? "",
    departmentCode: detail?.employee.departmentCode ?? "",
    positionCode: detail?.employee.positionCode ?? "",
    authorityCode: detail?.employee.authorityCode ?? "",
    password: "",
    residentRegistrationNoFront: detail?.employee.residentRegistrationNoFront ?? "",
    residentRegistrationNoBack: detail?.employee.residentRegistrationNoBack ?? "",
  };
}

export function EmployeeModal(props: {
  open: boolean;
  title: string;
  detail: EmployeeDetail | null;
  canViewContract: boolean;
  canEditSensitive: boolean;
  onClose: () => void;
  onSave: (payload: Partial<EmployeeFormState>) => Promise<void>;
  onUpload: (contractId: number, file: File) => Promise<void>;
  onDeleteFile: (contractId: number) => Promise<void>;
}) {
  const [form, setForm] = useState<EmployeeFormState>(toForm(props.detail));
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => { setForm(toForm(props.detail)); }, [props.detail]);

  async function handleSave() {
    const payload: Partial<EmployeeFormState> = {};
    Object.entries(form).forEach(([k, v]) => { if (v !== "") payload[k as keyof EmployeeFormState] = v; });
    try {
      await props.onSave(payload);
      setErrors({});
    } catch (error) {
      const e = error as { errors?: Array<{ field: string; message: string }> };
      const mapped: Record<string, string> = {};
      e.errors?.forEach((item) => { mapped[item.field] = item.message; });
      setErrors(mapped);
    }
  }

  return (
    <Modal open={props.open} title={props.title} size="large" onClose={props.onClose} footer={<div className="flex justify-end"><button className="rounded bg-slate-900 px-3 py-2 text-xs text-white" onClick={handleSave}>저장</button></div>}>
      <EmployeeForm form={form} errors={errors} canEditSensitive={props.canEditSensitive} onChange={(key, value) => setForm((prev) => ({ ...prev, [key]: value }))} />
      <ContractSection contracts={props.detail?.contracts ?? []} canViewContract={props.canViewContract} onUpload={(id, f) => void props.onUpload(id, f)} onDelete={(id) => void props.onDeleteFile(id)} />
    </Modal>
  );
}
