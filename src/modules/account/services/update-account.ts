import { and, eq } from "drizzle-orm";
import { NotFoundApiError } from "@/lib/api";
import { encrypt } from "@/lib/crypto/aes";
import { db, dbSchema } from "@/db";
import type { UpdateAccountInput } from "@/modules/account/validators/upsert-account";

export async function updateAccountService(accountId: number, input: UpdateAccountInput, actorId: number) {
  const [header] = await db
    .select({ id: dbSchema.accountHeader.id, deleteYn: dbSchema.accountHeader.deleteYn })
    .from(dbSchema.accountHeader)
    .where(and(eq(dbSchema.accountHeader.id, accountId), eq(dbSchema.accountHeader.deleteYn, "N")))
    .limit(1);

  if (!header || header.deleteYn === "Y") throw new NotFoundApiError("계정 헤더를 찾을 수 없습니다.");

  const headerUpdate: Record<string, unknown> = { updatedBy: actorId };
  if (input.url !== undefined) headerUpdate.url = input.url;
  if (input.title !== undefined) headerUpdate.title = input.title;
  if (input.tagsJson !== undefined) headerUpdate.tagsJson = input.tagsJson;

  await db.update(dbSchema.accountHeader).set(headerUpdate).where(eq(dbSchema.accountHeader.id, accountId));

  if (input.details && input.details.length > 0) {
    for (const detail of input.details) {
      if (detail.employeeId) {
        const [employee] = await db.select({ id: dbSchema.employee.id }).from(dbSchema.employee).where(and(eq(dbSchema.employee.id, detail.employeeId), eq(dbSchema.employee.deleteYn, "N"))).limit(1);
        if (!employee) throw new NotFoundApiError(`유효하지 않은 인원 ID입니다. (${detail.employeeId})`);
      }

      if (detail.id) {
        const [existing] = await db.select({ id: dbSchema.accountDetail.id }).from(dbSchema.accountDetail).where(and(eq(dbSchema.accountDetail.id, detail.id), eq(dbSchema.accountDetail.headerId, accountId))).limit(1);
        if (!existing) throw new NotFoundApiError(`상세 계정을 찾을 수 없습니다. (${detail.id})`);

        const detailUpdate: Record<string, unknown> = { updatedBy: actorId };
        if (detail.typeCode !== undefined) detailUpdate.typeCode = detail.typeCode || null;
        if (detail.loginTypeCode !== undefined) detailUpdate.loginTypeCode = detail.loginTypeCode || null;
        if (detail.idSourceType !== undefined) detailUpdate.idSourceType = detail.idSourceType;
        if (detail.idMasterId !== undefined) detailUpdate.idMasterId = detail.idMasterId;
        if (detail.loginId !== undefined) detailUpdate.loginId = detail.loginId || null;
        if (detail.passwordSourceType !== undefined) detailUpdate.passwordSourceType = detail.passwordSourceType;
        if (detail.passwordMasterId !== undefined) detailUpdate.passwordMasterId = detail.passwordMasterId;
        if (detail.authorityCode !== undefined) detailUpdate.authorityCode = detail.authorityCode || null;
        if (detail.employeeId !== undefined) detailUpdate.employeeId = detail.employeeId;
        if (detail.password !== undefined && detail.password.trim()) detailUpdate.passwordEnc = encrypt(detail.password);

        await db.update(dbSchema.accountDetail).set(detailUpdate).where(eq(dbSchema.accountDetail.id, detail.id));
      } else {
        await db.insert(dbSchema.accountDetail).values({
          headerId: accountId,
          typeCode: detail.typeCode || null,
          loginTypeCode: detail.loginTypeCode || null,
          idSourceType: detail.idSourceType ?? "MANUAL",
          idMasterId: detail.idMasterId ?? null,
          loginId: detail.loginId || null,
          passwordSourceType: detail.passwordSourceType ?? "MANUAL",
          passwordMasterId: detail.passwordMasterId ?? null,
          passwordEnc: encrypt(detail.password ?? ""),
          authorityCode: detail.authorityCode || null,
          employeeId: detail.employeeId ?? null,
          createdBy: actorId,
          updatedBy: actorId,
        });
      }
    }
  }

  return { id: accountId };
}
