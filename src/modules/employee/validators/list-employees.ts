import { z } from "zod";

export const listEmployeesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  name: z.string().trim().max(100).optional(),
  employeeNo: z.string().trim().max(50).optional(),
  phone: z.string().trim().max(50).optional(),
  birthDate: z.string().trim().regex(/^\d{8}$/, "birthDate는 YYYYMMDD 형식이어야 합니다.").optional(),
  employmentStatus: z.enum(["EMPLOYED", "RESIGNED", "ALL"]).optional(),
});

export type ListEmployeesQuery = z.infer<typeof listEmployeesQuerySchema>;
