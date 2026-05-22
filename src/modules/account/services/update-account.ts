import { and, eq } from "drizzle-orm";
import { NotFoundApiError, ValidationApiError } from "@/lib/api";
import { encrypt } from "@/lib/crypto/aes";
import { db, dbSchema } from "@/db";
import { ACCOUNT_TYPE_CODE, LOGIN_TYPE_CODE } from "@/modules/account/constants";
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
      if (detail.typeCode !== undefined && !Object.values(ACCOUNT_TYPE_CODE).includes(detail.typeCode)) {
        throw new ValidationApiError("유효하지 않은 계정 타입입니다.", [{ field: "typeCode", message: "typeCode는 1/2/3만 허용됩니다." }]);
      }
      if (detail.loginTypeCode !== undefined && !Object.values(LOGIN_TYPE_CODE).includes(detail.loginTypeCode)) {
        throw new ValidationApiError("유효하지 않은 로그인 타입입니다.", [{ field: "loginTypeCode", message: "loginTypeCode는 1~6만 허용됩니다." }]);
      }

      if (detail.employeeId) {
        const [employee] = await db.select({ id: dbSchema.employee.id }).from(dbSchema.employee).where(and(eq(dbSchema.employee.id, detail.employeeId), eq(dbSchema.employee.deleteYn, "N"))).limit(1);
        if (!employee) throw new NotFoundApiError(`유효하지 않은 인원 ID입니다. (${detail.employeeId})`);
      }

      if (detail.id) {
        const [existing] = await db.select({ id: dbSchema.accountDetail.id, passwordEnc: dbSchema.accountDetail.passwordEnc }).from(dbSchema.accountDetail).where(and(eq(dbSchema.accountDetail.id, detail.id), eq(dbSchema.accountDetail.headerId, accountId))).limit(1);
        if (!existing) throw new NotFoundApiError(`상세 계정을 찾을 수 없습니다. (${detail.id})`);

        const detailUpdate: Record<string, unknown> = { updatedBy: actorId };
        if (detail.typeCode !== undefined) detailUpdate.typeCode = detail.typeCode || null;
        if (detail.loginTypeCode !== undefined) detailUpdate.loginTypeCode = detail.loginTypeCode || null;

        const idSourceType = detail.idSourceType ?? "1";
        detailUpdate.idSourceType = idSourceType;
        if (idSourceType === "2") {
          const masterId = detail.idMasterId;
          if (!masterId) throw new ValidationApiError("유효하지 않은 아이디마스터 ID입니다.", [{ field: "idMasterId", message: "ID 마스터선택 시 아이디마스터 ID가 필요합니다." }]);
          const [idMaster] = await db.select({ id: dbSchema.idMaster.id, loginId: dbSchema.idMaster.loginId, useYn: dbSchema.idMaster.useYn }).from(dbSchema.idMaster).where(eq(dbSchema.idMaster.id, masterId)).limit(1);
          if (!idMaster || idMaster.useYn !== "Y") throw new ValidationApiError("사용 가능한 아이디마스터를 찾을 수 없습니다.", [{ field: "idMasterId", message: "활성화된 아이디마스터만 선택할 수 있습니다." }]);
          detailUpdate.idMasterId = idMaster.id;
          detailUpdate.loginId = idMaster.loginId;
        } else {
          if (detail.loginId !== undefined) detailUpdate.loginId = detail.loginId || null;
          detailUpdate.idMasterId = null;
        }

        const passwordSourceType = detail.passwordSourceType ?? "1";
        detailUpdate.passwordSourceType = passwordSourceType;
        if (passwordSourceType === "2") {
          const masterId = detail.passwordMasterId;
          if (!masterId) throw new ValidationApiError("유효하지 않은 비밀번호마스터 ID입니다.", [{ field: "passwordMasterId", message: "PW 마스터선택 시 비밀번호마스터 ID가 필요합니다." }]);
          const [passwordMaster] = await db.select({ id: dbSchema.passwordMaster.id, passwordEnc: dbSchema.passwordMaster.passwordEnc, useYn: dbSchema.passwordMaster.useYn }).from(dbSchema.passwordMaster).where(eq(dbSchema.passwordMaster.id, masterId)).limit(1);
          if (!passwordMaster || passwordMaster.useYn !== "Y") throw new ValidationApiError("사용 가능한 비밀번호마스터를 찾을 수 없습니다.", [{ field: "passwordMasterId", message: "활성화된 비밀번호마스터만 선택할 수 있습니다." }]);
          detailUpdate.passwordMasterId = passwordMaster.id;
          detailUpdate.passwordEnc = passwordMaster.passwordEnc;
        } else {
          detailUpdate.passwordMasterId = null;
          if (detail.password !== undefined && detail.password.trim()) detailUpdate.passwordEnc = encrypt(detail.password);
          if (detail.password !== undefined && !detail.password.trim()) detailUpdate.passwordEnc = existing.passwordEnc;
        }

        if (detail.authorityCode !== undefined) detailUpdate.authorityCode = detail.authorityCode || null;
        if (detail.employeeId !== undefined) detailUpdate.employeeId = detail.employeeId;

        await db.update(dbSchema.accountDetail).set(detailUpdate).where(eq(dbSchema.accountDetail.id, detail.id));
      } else {
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
        if (idSourceType === "1") idMasterId = null;

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
          passwordMasterId = null;
        }

        await db.insert(dbSchema.accountDetail).values({
          headerId: accountId,
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
    }
  }

  return { id: accountId };
}
