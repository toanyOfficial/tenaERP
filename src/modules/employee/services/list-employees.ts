import { createPaginationResponse, parsePagination } from "@/lib/pagination";
import { listEmployeesQuery } from "@/modules/employee/queries/list-employees";
import type { ListEmployeesQuery } from "@/modules/employee/validators/list-employees";

export async function listEmployeesService(query: ListEmployeesQuery) {
  const pagination = parsePagination({ page: query.page, limit: query.limit });
  const { items, totalCount } = await listEmployeesQuery({ query, ...pagination });

  return createPaginationResponse(
    items.map((item) => ({
      id: item.id,
      employeeNo: item.employeeNo,
      name: item.name,
      nickname: item.nickname,
      birthDate: item.birthDate,
      phone: item.phone,
      email: item.email,
      bankName: item.bankName,
      bankAccountNo: item.bankAccountNo,
      address: item.address,
      employmentStatus: item.resignDate ? "RESIGNED" : "EMPLOYED",
      updatedAt: item.updatedAt,
    })),
    totalCount,
    pagination,
  );
}
