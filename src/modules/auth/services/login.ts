import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { db, dbSchema } from "@/db";
import { AUTH_INVALID_CREDENTIALS_MESSAGE } from "@/modules/auth/constants";
import type { LoginSuccessUser } from "@/modules/auth/types";

export async function authenticateEmployee(employeeNo: string, password: string): Promise<LoginSuccessUser> {
  const [employee] = await db
    .select()
    .from(dbSchema.employee)
    .where(eq(dbSchema.employee.employeeNo, employeeNo))
    .limit(1);

  if (!employee || employee.deleteYn === "Y") {
    throw new Error(AUTH_INVALID_CREDENTIALS_MESSAGE);
  }

  const isMatch = await compare(password, employee.passwordHash);

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
