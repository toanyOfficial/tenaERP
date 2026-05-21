import { z } from "zod";

const ymSchema = z.string().trim().regex(/^\d{6}$/, "targetYm은 YYYYMM 형식이어야 합니다.");

const expenseCommitRowSchema = z.object({
  targetYm: ymSchema,
  categoryCode: z.string().trim().max(100).optional().or(z.literal("")),
  projectCode: z.string().trim().max(100).optional().or(z.literal("")),
  amount: z.coerce.number().int("amount는 정수여야 합니다."),
  memo: z.string().trim().optional().or(z.literal("")),
  rawData: z.unknown().optional(),
});

export const expenseCommitSchema = z.object({
  batchGroup: z.string().trim().min(1).max(100),
  batchSeq: z.coerce.number().int().positive(),
  title: z.string().trim().min(1).max(255),
  rows: z.array(expenseCommitRowSchema).min(1, "rows는 최소 1건 이상이어야 합니다."),
}).strict();

export type ExpenseCommitInput = z.infer<typeof expenseCommitSchema>;
