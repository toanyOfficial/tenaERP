import { and, eq } from "drizzle-orm";
import { NotFoundApiError } from "@/lib/api";
import { db, dbSchema } from "@/db";
import type { CreateSalesInput, UpdateSalesInput } from "@/modules/profit-loss/validators/sales-upsert";

export async function createSalesService(input: CreateSalesInput, actorId: number) {
  const [created] = await db.insert(dbSchema.sales).values({
    targetYm: input.targetYm,
    categoryCode: input.categoryCode || null,
    projectCode: input.projectCode || null,
    amount: input.amount,
    memo: input.memo || null,
    createdBy: actorId,
    updatedBy: actorId,
  }).$returningId();

  return { id: created?.id };
}

export async function updateSalesService(input: UpdateSalesInput, actorId: number) {
  const [found] = await db
    .select({ id: dbSchema.sales.id })
    .from(dbSchema.sales)
    .where(and(eq(dbSchema.sales.id, input.id)))
    .limit(1);

  if (!found) {
    throw new NotFoundApiError("매출 정보를 찾을 수 없습니다.");
  }

  await db
    .update(dbSchema.sales)
    .set({
      targetYm: input.targetYm,
      categoryCode: input.categoryCode === undefined ? undefined : input.categoryCode || null,
      projectCode: input.projectCode === undefined ? undefined : input.projectCode || null,
      amount: input.amount,
      memo: input.memo === undefined ? undefined : input.memo || null,
      updatedBy: actorId,
    })
    .where(eq(dbSchema.sales.id, input.id));

  return { id: input.id };
}
