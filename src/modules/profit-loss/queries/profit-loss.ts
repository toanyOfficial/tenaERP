import { and, gte, lte, sql } from "drizzle-orm";
import { db, dbSchema } from "@/db";

export async function queryMonthlySales(fromYm: string, toYm: string) {
  return db
    .select({ targetYm: dbSchema.sales.targetYm, amount: sql<number>`coalesce(sum(${dbSchema.sales.amount}), 0)` })
    .from(dbSchema.sales)
    .where(and(gte(dbSchema.sales.targetYm, fromYm), lte(dbSchema.sales.targetYm, toYm)))
    .groupBy(dbSchema.sales.targetYm);
}

export async function queryMonthlyExpense(fromYm: string, toYm: string) {
  return db
    .select({ targetYm: dbSchema.expense.targetYm, amount: sql<number>`coalesce(sum(${dbSchema.expense.amount}), 0)` })
    .from(dbSchema.expense)
    .where(and(gte(dbSchema.expense.targetYm, fromYm), lte(dbSchema.expense.targetYm, toYm)))
    .groupBy(dbSchema.expense.targetYm);
}
