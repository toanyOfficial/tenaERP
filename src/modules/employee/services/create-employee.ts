import { eq } from "drizzle-orm";
import { ApiError } from "@/lib/api";
import { encrypt } from "@/lib/crypto/aes";
import { db, dbSchema } from "@/db";
import { hashPassword } from "@/modules/auth/utils/password";
import { generateEmployeeNo } from "@/modules/employee/helpers/employee-no";
import type { CreateEmployeeInput } from "@/modules/employee/validators/create-employee";

export async function createEmployeeService(input: CreateEmployeeInput, actorId?: number) {
  const employeeNo = await generateEmployeeNo({
    name: input.name,
    englishName: input.englishName,
    joinDate: input.joinDate,
    residentRegistrationNoFront: input.residentRegistrationNoFront,
  });

  const exists = await db
    .select({ id: dbSchema.employee.id })
    .from(dbSchema.employee)
    .where(eq(dbSchema.employee.employeeNo, employeeNo))
    .limit(1);

  if (exists.length > 0) {
    throw new ApiError("사번 생성 중 충돌이 발생했습니다. 다시 시도해주세요.", "DUPLICATE_EMPLOYEE_NO", 409);
  }

  const passwordHash = await hashPassword(input.password);
  const residentBackEnc = encrypt(input.residentRegistrationNoBack);

  const [created] = await db
    .insert(dbSchema.employee)
    .values({
      employeeNo,
      passwordHash,
      residentRegistrationNoFront: input.residentRegistrationNoFront,
      residentRegistrationNoBackEnc: residentBackEnc,
      name: input.name,
      englishName: input.englishName || null,
      nickname: input.nickname || null,
      departmentCode: input.departmentCode || null,
      positionCode: input.positionCode || null,
      authorityCode: input.authorityCode,
      phone: input.phone,
      email: input.email || null,
      bankName: input.bankName || null,
      bankAccountNo: input.bankAccountNo || null,
      address: input.address || null,
      joinDate: input.joinDate ? new Date(input.joinDate) : null,
      resignDate: input.resignDate ? new Date(input.resignDate) : null,
      deleteYn: "N",
      createdBy: actorId ?? null,
      updatedBy: actorId ?? null,
    })
    .$returningId();

  return { id: created?.id, employeeNo };
}
