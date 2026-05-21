import { z } from "zod";

export const expenseRowSchema = z.object({
  targetYm: z.string().trim().regex(/^\d{6}$/, "targetYm은 YYYYMM 형식이어야 합니다."),
  categoryCode: z.string().trim().max(100).optional().or(z.literal("")),
  projectCode: z.string().trim().max(100).optional().or(z.literal("")),
  amount: z.coerce.number().int("amount는 정수여야 합니다."),
  memo: z.string().trim().optional().or(z.literal("")),
});

export type ExpensePreviewParsed = z.infer<typeof expenseRowSchema>;

export function validateExpenseRowBusiness(row: ExpensePreviewParsed) {
  const errors: string[] = [];
  if (row.amount < 0) errors.push("amount는 음수일 수 없습니다.");
  return { valid: errors.length === 0, errors };
}
