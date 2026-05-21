"use client";

import { FormField, Input } from "@/components/form";

export type EmployeeFormState = {
  phone: string;
  email: string;
  address: string;
  bankName: string;
  bankAccountNo: string;
  departmentCode: string;
  positionCode: string;
  authorityCode: string;
  password: string;
  residentRegistrationNoFront: string;
  residentRegistrationNoBack: string;
};

export function EmployeeForm(props: {
  form: EmployeeFormState;
  errors: Record<string, string | undefined>;
  canEditSensitive: boolean;
  onChange: (key: keyof EmployeeFormState, value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <FormField label="주민번호 앞" htmlFor="resident-front" errorMessage={props.errors.residentRegistrationNoFront}>
        <Input id="resident-front" value={props.form.residentRegistrationNoFront} onChange={(e) => props.onChange("residentRegistrationNoFront", e.target.value)} readOnly={!props.canEditSensitive} />
      </FormField>
      <FormField label="주민번호 뒤" htmlFor="resident-back" errorMessage={props.errors.residentRegistrationNoBack}>
        <Input id="resident-back" value={props.form.residentRegistrationNoBack} onChange={(e) => props.onChange("residentRegistrationNoBack", e.target.value)} readOnly={!props.canEditSensitive} />
      </FormField>
      <FormField label="연락처" htmlFor="phone" errorMessage={props.errors.phone}><Input id="phone" value={props.form.phone} onChange={(e) => props.onChange("phone", e.target.value)} /></FormField>
      <FormField label="메일" htmlFor="email" errorMessage={props.errors.email}><Input id="email" value={props.form.email} onChange={(e) => props.onChange("email", e.target.value)} /></FormField>
      <FormField label="은행" htmlFor="bankName" errorMessage={props.errors.bankName}><Input id="bankName" value={props.form.bankName} onChange={(e) => props.onChange("bankName", e.target.value)} /></FormField>
      <FormField label="계좌번호" htmlFor="bankAccountNo" errorMessage={props.errors.bankAccountNo}><Input id="bankAccountNo" value={props.form.bankAccountNo} onChange={(e) => props.onChange("bankAccountNo", e.target.value)} /></FormField>
      <FormField label="주소" htmlFor="address" errorMessage={props.errors.address}><Input id="address" value={props.form.address} onChange={(e) => props.onChange("address", e.target.value)} /></FormField>
      <FormField label="부서" htmlFor="departmentCode"><Input id="departmentCode" value={props.form.departmentCode} onChange={(e) => props.onChange("departmentCode", e.target.value)} /></FormField>
      <FormField label="직책" htmlFor="positionCode"><Input id="positionCode" value={props.form.positionCode} onChange={(e) => props.onChange("positionCode", e.target.value)} /></FormField>
      <FormField label="권한" htmlFor="authorityCode" errorMessage={props.errors.authorityCode}><Input id="authorityCode" value={props.form.authorityCode} onChange={(e) => props.onChange("authorityCode", e.target.value)} readOnly={!props.canEditSensitive} /></FormField>
      <FormField label="비밀번호" htmlFor="password" errorMessage={props.errors.password}><Input id="password" type="password" value={props.form.password} onChange={(e) => props.onChange("password", e.target.value)} /></FormField>
    </div>
  );
}
