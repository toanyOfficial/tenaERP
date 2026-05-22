"use client";

import { FormField, Input, Select } from "@/components/form";

export type EmployeeFormState = {
  name: string;
  englishName: string;
  nickname: string;
  phone: string;
  email: string;
  bankName: string;
  bankAccountNo: string;
  address: string;
  departmentCode: string;
  positionCode: string;
  authorityCode: string;
  joinDate: string;
  resignDate: string;
  password: string;
  residentRegistrationNoFront: string;
  residentRegistrationNoBack: string;
};

export type EmployeeCodeOptions = {
  bank: Array<{ key: string; value: string }>;
  department: Array<{ key: string; value: string }>;
  position: Array<{ key: string; value: string }>;
  authority: Array<{ key: string; value: string }>;
};

export function EmployeeForm(props: {
  form: EmployeeFormState;
  errors: Record<string, string | undefined>;
  canEditSensitive: boolean;
  codeOptions: EmployeeCodeOptions;
  onChange: (key: keyof EmployeeFormState, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-3"><FormField label="이름" htmlFor="name" errorMessage={props.errors.name}><Input id="name" value={props.form.name} onChange={(e) => props.onChange("name", e.target.value)} /></FormField></div>
      <div className="col-span-5"><FormField label="영문명" htmlFor="englishName" errorMessage={props.errors.englishName}><Input id="englishName" value={props.form.englishName} onChange={(e) => props.onChange("englishName", e.target.value)} /></FormField></div>
      <div className="col-span-4"><FormField label="닉네임" htmlFor="nickname" errorMessage={props.errors.nickname}><Input id="nickname" value={props.form.nickname} onChange={(e) => props.onChange("nickname", e.target.value)} /></FormField></div>

      <div className="col-span-3"><FormField label="주민번호 앞" htmlFor="resident-front" errorMessage={props.errors.residentRegistrationNoFront}><Input id="resident-front" value={props.form.residentRegistrationNoFront} onChange={(e) => props.onChange("residentRegistrationNoFront", e.target.value)} readOnly={!props.canEditSensitive} /></FormField></div>
      <div className="col-span-3"><FormField label="주민번호 뒤" htmlFor="resident-back" errorMessage={props.errors.residentRegistrationNoBack}><Input id="resident-back" type="password" value={props.form.residentRegistrationNoBack} onChange={(e) => props.onChange("residentRegistrationNoBack", e.target.value)} readOnly={!props.canEditSensitive} /></FormField></div>
      <div className="col-span-3"><FormField label="연락처" htmlFor="phone" errorMessage={props.errors.phone}><Input id="phone" value={props.form.phone} onChange={(e) => props.onChange("phone", e.target.value)} /></FormField></div>
      <div className="col-span-3"><FormField label="입사일자" htmlFor="joinDate" errorMessage={props.errors.joinDate}><Input id="joinDate" type="date" value={props.form.joinDate} onChange={(e) => props.onChange("joinDate", e.target.value)} /></FormField></div>

      <div className="col-span-6"><FormField label="메일" htmlFor="email" errorMessage={props.errors.email}><Input id="email" value={props.form.email} onChange={(e) => props.onChange("email", e.target.value)} /></FormField></div>
      <div className="col-span-3"><FormField label="은행" htmlFor="bankName" errorMessage={props.errors.bankName}><Select id="bankName" value={props.form.bankName} onChange={(e) => props.onChange("bankName", e.target.value)} options={props.codeOptions.bank.map((item, index) => ({ key: `BANK-${item.key}-${index}`, value: item.value, label: item.value }))} placeholder="선택" /></FormField></div>
      <div className="col-span-3"><FormField label="계좌번호" htmlFor="bankAccountNo" errorMessage={props.errors.bankAccountNo}><Input id="bankAccountNo" value={props.form.bankAccountNo} onChange={(e) => props.onChange("bankAccountNo", e.target.value)} /></FormField></div>

      <div className="col-span-12"><FormField label="주소" htmlFor="address" errorMessage={props.errors.address}><Input id="address" value={props.form.address} onChange={(e) => props.onChange("address", e.target.value)} /></FormField></div>

      <div className="col-span-4"><FormField label="부서" htmlFor="departmentCode" errorMessage={props.errors.departmentCode}><Select id="departmentCode" value={props.form.departmentCode} onChange={(e) => props.onChange("departmentCode", e.target.value)} options={props.codeOptions.department.map((item, index) => ({ key: `DEPARTMENT-${item.key}-${index}`, value: item.key, label: item.value }))} placeholder="선택" /></FormField></div>
      <div className="col-span-4"><FormField label="직책" htmlFor="positionCode" errorMessage={props.errors.positionCode}><Select id="positionCode" value={props.form.positionCode} onChange={(e) => props.onChange("positionCode", e.target.value)} options={props.codeOptions.position.map((item, index) => ({ key: `POSITION-${item.key}-${index}`, value: item.key, label: item.value }))} placeholder="선택" /></FormField></div>
      <div className="col-span-4"><FormField label="권한" htmlFor="authorityCode" errorMessage={props.errors.authorityCode}><Select id="authorityCode" value={props.form.authorityCode} onChange={(e) => props.onChange("authorityCode", e.target.value)} options={props.codeOptions.authority.map((item, index) => ({ key: `AUTHORITY-${item.key}-${index}`, value: item.key, label: item.value }))} placeholder="선택" readOnly={!props.canEditSensitive} /></FormField></div>

      <div className="col-span-6"><FormField label="비밀번호" htmlFor="password" errorMessage={props.errors.password}><Input id="password" type="password" value={props.form.password} onChange={(e) => props.onChange("password", e.target.value)} /></FormField></div>
      <div className="col-span-3"><FormField label="퇴사일자" htmlFor="resignDate" errorMessage={props.errors.resignDate}><Input id="resignDate" type="date" value={props.form.resignDate} onChange={(e) => props.onChange("resignDate", e.target.value)} /></FormField></div>
    </div>
  );
}
