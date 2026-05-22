import { z } from "zod";

const optionalTrimmed = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}, z.string().optional());

export const listEmployeesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  name: optionalTrimmed.pipe(z.string().max(100).optional()),
  employeeNo: optionalTrimmed.pipe(z.string().max(50).optional()),
  phone: optionalTrimmed.pipe(z.string().max(50).optional()),
  birthDate: z
    .preprocess((value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    }, z.string().regex(/^(\d{8}|\d{4}-\d{2}-\d{2})$/, "birthDate는 YYYYMMDD 또는 YYYY-MM-DD 형식이어야 합니다.").optional())
    .transform((value) => (value ? value.replaceAll("-", "") : value)),
  employmentStatus: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed.length === 0 || trimmed === "ALL" ? undefined : trimmed;
  }, z.enum(["EMPLOYED", "RESIGNED"]).optional()),
});

export type ListEmployeesQuery = z.infer<typeof listEmployeesQuerySchema>;
