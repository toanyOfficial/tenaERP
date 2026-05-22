"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";
import { EmployeeForm, type EmployeeCodeOptions, type EmployeeFormState } from "@/modules/employee/pages/components/EmployeeForm";
import { ContractSection } from "@/modules/employee/pages/components/ContractSection";
import type { EmployeeDetail } from "@/modules/employee/pages/components/types";

function toForm(detail: EmployeeDetail | null): EmployeeFormState {
  return {
    name: detail?.employee.name ?? "",
    englishName: detail?.employee.englishName ?? "",
    nickname: detail?.employee.nickname ?? "",
    phone: detail?.employee.phone ?? "",
    email: detail?.employee.email ?? "",
    address: detail?.employee.address ?? "",
    bankName: detail?.employee.bankName ?? "",
    bankAccountNo: detail?.employee.bankAccountNo ?? "",
    departmentCode: detail?.employee.departmentCode ?? "",
    positionCode: detail?.employee.positionCode ?? "",
    authorityCode: detail?.employee.authorityCode ?? "",
    joinDate: detail?.employee.joinDate ?? "",
    resignDate: detail?.employee.resignDate ?? "",
    password: "",
    residentRegistrationNoFront: detail?.employee.residentRegistrationNoFront ?? "",
    residentRegistrationNoBack: detail?.employee.residentRegistrationNoBack ?? "",
  };
}

const EMPTY_CODES: EmployeeCodeOptions = { bank: [], department: [], position: [], authority: [] };

export function EmployeeModal(props: {
  open: boolean;
  title: string;
  detail: EmployeeDetail | null;
  canViewContract: boolean;
  canEditSensitive: boolean;
  onClose: () => void;
  onSave: (payload: Partial<EmployeeFormState> & { contracts?: EmployeeDetail["contracts"] }) => Promise<void>;
  onUpload: (contractId: number, file: File) => Promise<void>;
  onDeleteFile: (contractId: number) => Promise<void>;
}) {
  const [form, setForm] = useState<EmployeeFormState>(toForm(props.detail));
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [codeOptions, setCodeOptions] = useState<EmployeeCodeOptions>(EMPTY_CODES);
  const [contracts, setContracts] = useState<EmployeeDetail["contracts"]>(props.detail?.contracts ?? []);

  useEffect(() => { setForm(toForm(props.detail)); }, [props.detail]);
  useEffect(() => { setContracts(props.detail?.contracts ?? []); }, [props.detail]);

  useEffect(() => {
    if (!props.open) return;

    void (async () => {
      try {
        const res = await fetch("/api/base-codes?groups=BANK,DEPARTMENT,POSITION,AUTHORITY");
        const json = await res.json();
        if (!json.success) return;

        setCodeOptions({
          bank: json.data.BANK ?? [],
          department: json.data.DEPARTMENT ?? [],
          position: json.data.POSITION ?? [],
          authority: json.data.AUTHORITY ?? [],
        });
      } catch {
        setCodeOptions(EMPTY_CODES);
      }
    })();
  }, [props.open]);

  useEffect(() => {
    if (!props.open) return;

    void (async () => {
      try {
        const res = await fetch("/api/base-codes?groups=BANK,DEPARTMENT,POSITION,AUTHORITY");
        const json = await res.json();
        if (!json.success) return;

        setCodeOptions({
          bank: json.data.BANK ?? [],
          department: json.data.DEPARTMENT ?? [],
          position: json.data.POSITION ?? [],
          authority: json.data.AUTHORITY ?? [],
        });
      } catch {
        setCodeOptions(EMPTY_CODES);
      }
    })();
  }, [props.open]);

  async function handleSave() {
    const payload: Partial<EmployeeFormState> & { contracts?: EmployeeDetail["contracts"] } = {};
    Object.entries(form).forEach(([k, v]) => { if (v !== "") payload[k as keyof EmployeeFormState] = v; });
    payload.contracts = contracts;
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
      <EmployeeForm form={form} errors={errors} canEditSensitive={props.canEditSensitive} codeOptions={codeOptions} onChange={(key, value) => setForm((prev) => ({ ...prev, [key]: value }))} />
      <ContractSection
        contracts={contracts}
        canViewContract={props.canViewContract}
        canEditContract={props.canViewContract}
        onContractsChange={setContracts}
        onUpload={(id, f) => void props.onUpload(id, f)}
        onDelete={(id) => void props.onDeleteFile(id)}
      />
    </Modal>
  );
}
