"use client";

import { Grid, type GridColumn } from "@/components/grid";
import type { EmployeeListRow } from "@/modules/employee/pages/components/types";

const columns: GridColumn<EmployeeListRow>[] = [
  { key: "employeeNo", header: "사번", width: 120, value: (r) => r.employeeNo },
  { key: "name", header: "이름", width: 100, value: (r) => r.name },
  { key: "nickname", header: "닉네임", width: 100, value: (r) => r.nickname ?? "-" },
  { key: "birthDate", header: "생년월일", width: 120, value: (r) => r.birthDate ?? "-" },
  { key: "phone", header: "연락처", width: 130, value: (r) => r.phone ?? "-" },
  { key: "email", header: "메일", width: 180, value: (r) => r.email ?? "-" },
  { key: "bankName", header: "은행", width: 100, value: (r) => r.bankName ?? "-" },
  { key: "bankAccountNo", header: "계좌번호", width: 180, value: (r) => r.bankAccountNo ?? "-" },
  { key: "address", header: "주소", width: 220, value: (r) => r.address ?? "-" },
];

export function EmployeeGrid(props: {
  rows: EmployeeListRow[];
  loading: boolean;
  errorMessage: string | null;
  onRowClick: (row: EmployeeListRow) => void;
}) {
  return (
    <Grid
      columns={columns}
      rows={props.rows}
      rowKey={(row) => String(row.id)}
      onRowClick={(row) => props.onRowClick(row)}
      loading={props.loading}
      errorMessage={props.errorMessage}
      emptyMode="no-result"
    />
  );
}
