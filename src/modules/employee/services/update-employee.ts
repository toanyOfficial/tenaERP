import { and, eq } from "drizzle-orm";
import { ForbiddenApiError, NotFoundApiError } from "@/lib/api";
import { encrypt } from "@/lib/crypto/aes";
import { db, dbSchema } from "@/db";
import { hashPassword } from "@/modules/auth/utils/password";
import { isExecutive } from "@/modules/auth/helpers/authority";
import type { UpdateEmployeeInput } from "@/modules/employee/validators/update-employee";

type UpdateEmployeeParams = {
  employeeId: number;
  actorId: number;
  actorAuthorityCode: string | null;
  input: UpdateEmployeeInput;
};

export async function updateEmployeeService(params: UpdateEmployeeParams) {
  const [employee] = await db
    .select({ id: dbSchema.employee.id, deleteYn: dbSchema.employee.deleteYn })
    .from(dbSchema.employee)
    .where(and(eq(dbSchema.employee.id, params.employeeId), eq(dbSchema.employee.deleteYn, "N")))
    .limit(1);

  if (!employee || employee.deleteYn === "Y") {
    throw new NotFoundApiError("인원 정보를 찾을 수 없습니다.");
  }

  const needsExecutivePermission =
    params.input.authorityCode !== undefined ||
    params.input.residentRegistrationNoFront !== undefined ||
    params.input.residentRegistrationNoBack !== undefined;

  if (needsExecutivePermission && !isExecutive(params.actorAuthorityCode)) {
    throw new ForbiddenApiError("민감정보는 임원 이상만 수정할 수 있습니다.");
  }

  const updatePayload: Record<string, unknown> = {
    updatedBy: params.actorId,
  };

  if (params.input.phone !== undefined) updatePayload.phone = params.input.phone || null;
  if (params.input.email !== undefined) updatePayload.email = params.input.email || null;
  if (params.input.address !== undefined) updatePayload.address = params.input.address || null;
  if (params.input.bankName !== undefined) updatePayload.bankName = params.input.bankName || null;
  if (params.input.bankAccountNo !== undefined) updatePayload.bankAccountNo = params.input.bankAccountNo || null;
  if (params.input.departmentCode !== undefined) updatePayload.departmentCode = params.input.departmentCode || null;
  if (params.input.positionCode !== undefined) updatePayload.positionCode = params.input.positionCode || null;
  if (params.input.authorityCode !== undefined) updatePayload.authorityCode = params.input.authorityCode || null;

  if (params.input.password !== undefined) {
    updatePayload.passwordHash = await hashPassword(params.input.password);
  }

  if (params.input.residentRegistrationNoFront !== undefined && params.input.residentRegistrationNoBack !== undefined) {
    updatePayload.residentRegistrationNoFront = params.input.residentRegistrationNoFront;
    updatePayload.residentRegistrationNoBackEnc = encrypt(params.input.residentRegistrationNoBack);
  }

  await db
    .update(dbSchema.employee)
    .set(updatePayload)
    .where(and(eq(dbSchema.employee.id, params.employeeId), eq(dbSchema.employee.deleteYn, "N")));

  return { id: params.employeeId };
}
