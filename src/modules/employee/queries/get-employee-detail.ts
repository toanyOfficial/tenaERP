import { and, asc, eq } from "drizzle-orm";
import { db, dbSchema } from "@/db";

export async function getEmployeeDetailQuery(employeeId: number) {
  const [employee] = await db
    .select({
      id: dbSchema.employee.id,
      name: dbSchema.employee.name,
      englishName: dbSchema.employee.englishName,
      nickname: dbSchema.employee.nickname,
      phone: dbSchema.employee.phone,
      email: dbSchema.employee.email,
      address: dbSchema.employee.address,
      bankName: dbSchema.employee.bankName,
      bankAccountNo: dbSchema.employee.bankAccountNo,
      departmentCode: dbSchema.employee.departmentCode,
      positionCode: dbSchema.employee.positionCode,
      authorityCode: dbSchema.employee.authorityCode,
      residentRegistrationNoFront: dbSchema.employee.residentRegistrationNoFront,
      residentRegistrationNoBackEnc: dbSchema.employee.residentRegistrationNoBackEnc,
      deleteYn: dbSchema.employee.deleteYn,
    })
    .from(dbSchema.employee)
    .where(and(eq(dbSchema.employee.id, employeeId), eq(dbSchema.employee.deleteYn, "N")))
    .limit(1);

  if (!employee) return null;

  const contracts = await db
    .select({
      id: dbSchema.employeeContract.id,
      writtenDate: dbSchema.employeeContract.writtenDate,
      contractStartDate: dbSchema.employeeContract.contractStartDate,
      contractEndDate: dbSchema.employeeContract.contractEndDate,
      annualSalary: dbSchema.employeeContract.annualSalary,
      filePath: dbSchema.employeeContract.filePath,
      deleteYn: dbSchema.employeeContract.deleteYn,
    })
    .from(dbSchema.employeeContract)
    .where(and(eq(dbSchema.employeeContract.employeeId, employeeId), eq(dbSchema.employeeContract.deleteYn, "N")))
    .orderBy(asc(dbSchema.employeeContract.contractStartDate), asc(dbSchema.employeeContract.id));

  return { employee, contracts };
}
