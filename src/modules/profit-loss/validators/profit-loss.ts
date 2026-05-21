import { z } from "zod";

const ymSchema = z.string().regex(/^\d{6}$/, "년월은 YYYYMM 형식이어야 합니다.");

export const profitLossQuerySchema = z.object({
  fromYm: ymSchema.optional(),
  toYm: ymSchema.optional(),
});

export type ProfitLossQuery = z.infer<typeof profitLossQuerySchema>;

function addMonths(baseYm: string, delta: number) {
  const y = Number(baseYm.slice(0, 4));
  const m = Number(baseYm.slice(4, 6));
  const date = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function resolveProfitLossRange(query: ProfitLossQuery, now = new Date()) {
  const currentYm = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const defaultFromYm = addMonths(currentYm, -5);

  const fromYm = query.fromYm ?? defaultFromYm;
  const toYm = query.toYm ?? currentYm;

  if (fromYm > toYm) {
    return {
      success: false as const,
      message: "조회 기간이 올바르지 않습니다.",
      errors: [{ field: "fromYm", message: "fromYm은 toYm보다 작거나 같아야 합니다." }],
    };
  }

  return { success: true as const, fromYm, toYm };
}
