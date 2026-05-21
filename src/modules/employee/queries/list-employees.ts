import { and, desc, eq, like, sql } from "drizzle-orm";
import { db, dbSchema } from "@/db";
import type { ListEmployeesQuery } from "@/modules/employee/validators/list-employees";

function buildConditions(query: ListEmployeesQuery) {
  const conditions = [eq(dbSchema.employee.deleteYn, "N")];

  if (query.name) conditions.push(like(dbSchema.employee.name, `%${query.name}%`));
  if (query.employeeNo) conditions.push(like(dbSchema.employee.employeeNo, `%${query.employeeNo}%`));
  if (query.phone) conditions.push(like(dbSchema.employee.phone, `%${query.phone}%`));
  if (query.birthDate) conditions.push(eq(dbSchema.employee.residentRegistrationNoFront, query.birthDate.slice(2, 8)));
  if (query.employmentStatus === "EMPLOYED") conditions.push(sql`${dbSchema.employee.resignDate} is null`);
  if (query.employmentStatus === "RESIGNED") conditions.push(sql`${dbSchema.employee.resignDate} is not null`);

  return and(...conditions);
}

export async function listEmployeesQuery(params: {
  query: ListEmployeesQuery;
  page: number;
  limit: number;
  offset: number;
}) {
  const where = buildConditions(params.query);

  const [countRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(dbSchema.employee)
    .where(where);

  const items = await db
    .select({
      id: dbSchema.employee.id,
      employeeNo: dbSchema.employee.employeeNo,
      name: dbSchema.employee.name,
      nickname: dbSchema.employee.nickname,
      birthDate: dbSchema.employee.residentRegistrationNoFront,
      phone: dbSchema.employee.phone,
      email: dbSchema.employee.email,
      bankName: dbSchema.employee.bankName,
      bankAccountNo: dbSchema.employee.bankAccountNo,
      address: dbSchema.employee.address,
      resignDate: dbSchema.employee.resignDate,
      updatedAt: dbSchema.employee.updatedAt,
    })
    .from(dbSchema.employee)
    .where(where)
    .orderBy(desc(dbSchema.employee.updatedAt), desc(dbSchema.employee.id))
    .limit(params.limit)
    .offset(params.offset);

  return { totalCount: Number(countRow?.count ?? 0), items };
}
