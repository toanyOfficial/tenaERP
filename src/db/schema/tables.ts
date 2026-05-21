import {
  bigint,
  char,
  date,
  datetime,
  index,
  json,
  mysqlTable,
  text,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

const idPk = bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey();
const createdAt = datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`);
const updatedAt = datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
const createdBy = bigint("created_by", { mode: "number", unsigned: true });
const updatedBy = bigint("updated_by", { mode: "number", unsigned: true });

export const baseCode = mysqlTable(
  "base_code",
  {
    id: idPk,
    group: varchar("group", { length: 100 }).notNull(),
    key: varchar("key", { length: 100 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    description: text("description"),
    useYn: char("use_yn", { length: 1 }).notNull().default("Y"),
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
  },
  (t) => [unique("uk_base_code_group_key").on(t.group, t.key)],
);

export const employee = mysqlTable(
  "employee",
  {
    id: idPk,
    employeeNo: varchar("employee_no", { length: 50 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    residentRegistrationNoFront: char("resident_registration_no_front", { length: 6 }),
    residentRegistrationNoBackEnc: varchar("resident_registration_no_back_enc", { length: 512 }),
    name: varchar("name", { length: 100 }).notNull(),
    englishName: varchar("english_name", { length: 100 }),
    nickname: varchar("nickname", { length: 100 }),
    departmentCode: varchar("department_code", { length: 100 }),
    positionCode: varchar("position_code", { length: 100 }),
    authorityCode: varchar("authority_code", { length: 100 }),
    phone: varchar("phone", { length: 50 }),
    email: varchar("email", { length: 255 }),
    bankName: varchar("bank_name", { length: 100 }),
    bankAccountNo: varchar("bank_account_no", { length: 255 }),
    address: varchar("address", { length: 500 }),
    joinDate: date("join_date"),
    resignDate: date("resign_date"),
    deleteYn: char("delete_yn", { length: 1 }).notNull().default("N"),
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
  },
  (t) => [unique("uk_employee_employee_no").on(t.employeeNo), index("idx_employee_name").on(t.name), index("idx_employee_phone").on(t.phone), index("idx_employee_authority").on(t.authorityCode)],
);

export const employeeContract = mysqlTable("employee_contract", {
  id: idPk,
  employeeId: bigint("employee_id", { mode: "number", unsigned: true }).notNull().references(() => employee.id),
  writtenDate: date("written_date"),
  contractStartDate: date("contract_start_date").notNull(),
  contractEndDate: date("contract_end_date"),
  annualSalary: bigint("annual_salary", { mode: "number" }),
  filePath: varchar("file_path", { length: 1000 }),
  deleteYn: char("delete_yn", { length: 1 }).notNull().default("N"),
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
});

export const accountHeader = mysqlTable("account_header", {
  id: idPk,
  url: varchar("url", { length: 1000 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  tagsJson: json("tags_json"),
  deleteYn: char("delete_yn", { length: 1 }).notNull().default("N"),
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
});

export const accountDetail = mysqlTable("account_detail", {
  id: idPk,
  headerId: bigint("header_id", { mode: "number", unsigned: true }).notNull().references(() => accountHeader.id),
  typeCode: varchar("type_code", { length: 100 }),
  loginTypeCode: varchar("login_type_code", { length: 100 }),
  loginId: varchar("login_id", { length: 255 }),
  passwordEnc: varchar("password_enc", { length: 512 }),
  authorityCode: varchar("authority_code", { length: 100 }),
  employeeId: bigint("employee_id", { mode: "number", unsigned: true }).references(() => employee.id),
  memo: text("memo"),
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
});

export const idMaster = mysqlTable("id_master", {
  id: idPk,
  title: varchar("title", { length: 255 }).notNull(),
  loginId: varchar("login_id", { length: 255 }).notNull(),
  useYn: char("use_yn", { length: 1 }).notNull().default("Y"),
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
});

export const passwordMaster = mysqlTable("password_master", {
  id: idPk,
  authorityCode: varchar("authority_code", { length: 100 }),
  title: varchar("title", { length: 255 }).notNull(),
  passwordEnc: varchar("password_enc", { length: 512 }).notNull(),
  useYn: char("use_yn", { length: 1 }).notNull().default("Y"),
  immutableYn: char("immutable_yn", { length: 1 }).notNull().default("Y"),
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
});

export const expense = mysqlTable("expense", {
  id: idPk,
  targetYm: char("target_ym", { length: 6 }).notNull(),
  categoryCode: varchar("category_code", { length: 100 }),
  projectCode: varchar("project_code", { length: 100 }),
  amount: bigint("amount", { mode: "number" }).notNull().default(0),
  memo: text("memo"),
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
},(t)=>[index("idx_expense_target_ym").on(t.targetYm)]);

export const sales = mysqlTable("sales", {
  id: idPk,
  targetYm: char("target_ym", { length: 6 }).notNull(),
  categoryCode: varchar("category_code", { length: 100 }),
  projectCode: varchar("project_code", { length: 100 }),
  amount: bigint("amount", { mode: "number" }).notNull().default(0),
  memo: text("memo"),
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
},(t)=>[index("idx_sales_target_ym").on(t.targetYm)]);

export const bankAccount = mysqlTable("bank_account", {
  id: idPk,
  bankName: varchar("bank_name", { length: 100 }).notNull(),
  accountNo: varchar("account_no", { length: 255 }).notNull(),
  depositorName: varchar("depositor_name", { length: 255 }).notNull(),
  authorityCode: varchar("authority_code", { length: 100 }),
  bankPasswordEnc: varchar("bank_password_enc", { length: 512 }),
  internetBankingId: varchar("internet_banking_id", { length: 255 }),
  internetBankingPasswordEnc: varchar("internet_banking_password_enc", { length: 512 }),
  otpSerialNo: varchar("otp_serial_no", { length: 255 }),
  projectCode: varchar("project_code", { length: 100 }),
  memo: text("memo"),
  useYn: char("use_yn", { length: 1 }).notNull().default("Y"),
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
});

export const bankTransaction = mysqlTable("bank_transaction", {
  id: idPk,
  accountId: bigint("account_id", { mode: "number", unsigned: true }).notNull().references(() => bankAccount.id),
  transactionDatetime: datetime("transaction_datetime").notNull(),
  depositAmount: bigint("deposit_amount", { mode: "number" }).notNull().default(0),
  withdrawAmount: bigint("withdraw_amount", { mode: "number" }).notNull().default(0),
  balanceAmount: bigint("balance_amount", { mode: "number" }),
  description: varchar("description", { length: 1000 }),
  settlementReflectedYn: char("settlement_reflected_yn", { length: 1 }).notNull().default("N"),
  rawDataJson: json("raw_data_json"),
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
},(t)=>[index("idx_bank_transaction_datetime").on(t.transactionDatetime)]);

export const cardSalesImport = mysqlTable("card_sales_import", {
  id: idPk,
  approvalDate: date("approval_date"),
  approvalDatetime: datetime("approval_datetime"),
  cardCompany: varchar("card_company", { length: 100 }),
  merchantName: varchar("merchant_name", { length: 255 }),
  approvalAmount: bigint("approval_amount", { mode: "number" }).notNull().default(0),
  settlementReflectedYn: char("settlement_reflected_yn", { length: 1 }).notNull().default("N"),
  rawDataJson: json("raw_data_json"),
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
},(t)=>[index("idx_card_sales_import_approval_date").on(t.approvalDate)]);

export const batchLog = mysqlTable("batch_log", {
  id: idPk,
  batchGroup: varchar("batch_group", { length: 100 }).notNull(),
  batchSeq: bigint("batch_seq", { mode: "number" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  executedDate: datetime("executed_date").notNull(),
  createdAt,
  updatedAt,
}, (t)=>[unique("uk_batch_log_group_seq").on(t.batchGroup, t.batchSeq)]);
