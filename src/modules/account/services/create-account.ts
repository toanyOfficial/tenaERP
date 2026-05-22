import { and, eq } from "drizzle-orm";
import { ApiError, NotFoundApiError, ValidationApiError } from "@/lib/api";
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

    const idSourceType = detail.idSourceType ?? "1";
    const passwordSourceType = detail.passwordSourceType ?? "1";

    let loginId = detail.loginId?.trim() || null;
    let idMasterId: number | null = null;

    if (idSourceType === "2") {
      const masterId = detail.idMasterId;
      if (!masterId) throw new ValidationApiError("유효하지 않은 아이디마스터 ID입니다.", [{ field: "idMasterId", message: "ID 마스터선택 시 아이디마스터 ID가 필요합니다." }]);
      const [idMaster] = await db.select({ id: dbSchema.idMaster.id, loginId: dbSchema.idMaster.loginId, useYn: dbSchema.idMaster.useYn }).from(dbSchema.idMaster).where(eq(dbSchema.idMaster.id, masterId)).limit(1);
      if (!idMaster || idMaster.useYn !== "Y") throw new ValidationApiError("사용 가능한 아이디마스터를 찾을 수 없습니다.", [{ field: "idMasterId", message: "활성화된 아이디마스터만 선택할 수 있습니다." }]);
      loginId = idMaster.loginId;
      idMasterId = idMaster.id;
    }

    let passwordEnc = "";
    let passwordMasterId: number | null = null;

    if (passwordSourceType === "2") {
      const masterId = detail.passwordMasterId;
      if (!masterId) throw new ValidationApiError("유효하지 않은 비밀번호마스터 ID입니다.", [{ field: "passwordMasterId", message: "PW 마스터선택 시 비밀번호마스터 ID가 필요합니다." }]);
      const [passwordMaster] = await db.select({ id: dbSchema.passwordMaster.id, passwordEnc: dbSchema.passwordMaster.passwordEnc, useYn: dbSchema.passwordMaster.useYn }).from(dbSchema.passwordMaster).where(eq(dbSchema.passwordMaster.id, masterId)).limit(1);
      if (!passwordMaster || passwordMaster.useYn !== "Y") throw new ValidationApiError("사용 가능한 비밀번호마스터를 찾을 수 없습니다.", [{ field: "passwordMasterId", message: "활성화된 비밀번호마스터만 선택할 수 있습니다." }]);
      passwordEnc = passwordMaster.passwordEnc;
      passwordMasterId = passwordMaster.id;
    } else {
      passwordEnc = encrypt(detail.password ?? "");
    }

    await db.insert(dbSchema.accountDetail).values({
      headerId,
      typeCode: detail.typeCode || null,
      loginTypeCode: detail.loginTypeCode || null,
      idSourceType,
      idMasterId,
      loginId,
      passwordSourceType,
      passwordMasterId,
      passwordEnc,
      authorityCode: detail.authorityCode || null,
      employeeId: detail.employeeId ?? null,
      createdBy: actorId,
      updatedBy: actorId,
    });
  }

  return { id: headerId };
}
