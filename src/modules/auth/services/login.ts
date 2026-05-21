import { eq } from "drizzle-orm";
import { db, dbSchema } from "@/db";
import { AUTH_INVALID_CREDENTIALS_MESSAGE } from "@/modules/auth/constants";
import type { LoginSuccessUser } from "@/modules/auth/types";
import { comparePassword } from "@/modules/auth/utils/password";

export async function authenticateEmployee(employeeNo: string, password: string): Promise<LoginSuccessUser> {
  const [employee] = await db
    .select()
    .from(dbSchema.employee)
    .where(eq(dbSchema.employee.employeeNo, employeeNo))
    .limit(1);

  if (!employee || employee.deleteYn === "Y") {
    throw new Error(AUTH_INVALID_CREDENTIALS_MESSAGE);
  }

  const isMatch = await comparePassword(password, employee.passwordHash);

  if (!isMatch) {
    throw new Error(AUTH_INVALID_CREDENTIALS_MESSAGE);
  }

  return {
    id: employee.id,
    employeeNo: employee.employeeNo,
    name: employee.name,
    authorityCode: employee.authorityCode,
  };
}
