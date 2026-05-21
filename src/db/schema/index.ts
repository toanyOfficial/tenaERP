import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  accountDetail,
  accountHeader,
  bankAccount,
  bankTransaction,
  baseCode,
  batchLog,
  cardSalesImport,
  employee,
  employeeContract,
  expense,
  idMaster,
  passwordMaster,
  sales,
} from "@/db/schema/tables";

export {
  baseCode,
  employee,
  employeeContract,
  accountHeader,
  accountDetail,
  idMaster,
  passwordMaster,
  sales,
  expense,
  bankAccount,
  bankTransaction,
  cardSalesImport,
  batchLog,
};

export type BaseCode = InferSelectModel<typeof baseCode>;
export type NewBaseCode = InferInsertModel<typeof baseCode>;
export type Employee = InferSelectModel<typeof employee>;
export type NewEmployee = InferInsertModel<typeof employee>;
export type EmployeeContract = InferSelectModel<typeof employeeContract>;
export type NewEmployeeContract = InferInsertModel<typeof employeeContract>;
export type AccountHeader = InferSelectModel<typeof accountHeader>;
export type NewAccountHeader = InferInsertModel<typeof accountHeader>;
export type AccountDetail = InferSelectModel<typeof accountDetail>;
export type NewAccountDetail = InferInsertModel<typeof accountDetail>;
export type IdMaster = InferSelectModel<typeof idMaster>;
export type NewIdMaster = InferInsertModel<typeof idMaster>;
export type PasswordMaster = InferSelectModel<typeof passwordMaster>;
export type NewPasswordMaster = InferInsertModel<typeof passwordMaster>;
export type Sales = InferSelectModel<typeof sales>;
export type NewSales = InferInsertModel<typeof sales>;
export type Expense = InferSelectModel<typeof expense>;
export type NewExpense = InferInsertModel<typeof expense>;
export type BankAccount = InferSelectModel<typeof bankAccount>;
export type NewBankAccount = InferInsertModel<typeof bankAccount>;
export type BankTransaction = InferSelectModel<typeof bankTransaction>;
export type NewBankTransaction = InferInsertModel<typeof bankTransaction>;
export type CardSalesImport = InferSelectModel<typeof cardSalesImport>;
export type NewCardSalesImport = InferInsertModel<typeof cardSalesImport>;
export type BatchLog = InferSelectModel<typeof batchLog>;
export type NewBatchLog = InferInsertModel<typeof batchLog>;
