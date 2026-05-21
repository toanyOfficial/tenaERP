import { z } from "zod";

const ymSchema = z.string().trim().regex(/^\d{6}$/, "년월은 YYYYMM 형식이어야 합니다.");

export const createSalesSchema = z.object({
  targetYm: ymSchema,
  categoryCode: z.string().trim().max(100).optional().or(z.literal("")),
  projectCode: z.string().trim().max(100).optional().or(z.literal("")),
  amount: z.coerce.number().int("금액은 정수여야 합니다."),
  memo: z.string().trim().optional().or(z.literal("")),
}).strict();

export const updateSalesSchema = z.object({
  id: z.coerce.number().int().positive(),
  targetYm: ymSchema.optional(),
  categoryCode: z.string().trim().max(100).optional().or(z.literal("")),
  projectCode: z.string().trim().max(100).optional().or(z.literal("")),
  amount: z.coerce.number().int("금액은 정수여야 합니다.").optional(),
  memo: z.string().trim().optional().or(z.literal("")),
}).strict();

export type CreateSalesInput = z.infer<typeof createSalesSchema>;
export type UpdateSalesInput = z.infer<typeof updateSalesSchema>;

export function validateSalesBusiness(amount: number) {
  if (amount < 0) {
    return {
      success: false as const,
      message: "금액은 음수일 수 없습니다.",
      errors: [{ field: "amount", message: "0 이상의 금액을 입력해주세요." }],
    };
  }

  return { success: true as const };
}
