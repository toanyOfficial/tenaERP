import { and, eq } from "drizzle-orm";
import { ApiError, NotFoundApiError } from "@/lib/api";
import { encrypt } from "@/lib/crypto/aes";
import { db, dbSchema } from "@/db";
import type { CreateAccountInput } from "@/modules/account/validators/upsert-account";

export async function createAccountService(input: CreateAccountInput, actorId: number) {
  const [createdHeader] = await db
    .insert(dbSchema.accountHeader)
    .values({
      url: input.url,
      title: input.title,
      tagsJson: input.tagsJson ?? null,
      deleteYn: "N",
      createdBy: actorId,
      updatedBy: actorId,
    })
    .$returningId();

  const headerId = createdHeader?.id;
  if (!headerId) throw new ApiError("계정 헤더 생성에 실패했습니다.", "ACCOUNT_HEADER_CREATE_FAILED", 500);

  for (const detail of input.details) {
    if (detail.employeeId) {
      const [employee] = await db.select({ id: dbSchema.employee.id }).from(dbSchema.employee).where(and(eq(dbSchema.employee.id, detail.employeeId), eq(dbSchema.employee.deleteYn, "N"))).limit(1);
      if (!employee) throw new NotFoundApiError(`유효하지 않은 인원 ID입니다. (${detail.employeeId})`);
    }

    await db.insert(dbSchema.accountDetail).values({
      headerId,
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

  return { id: headerId };
}
