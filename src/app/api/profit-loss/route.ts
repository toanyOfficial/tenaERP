import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateQuery } from "@/lib/validation";
import { getProfitLossSummaryService } from "@/modules/profit-loss/services/profit-loss";
import { profitLossQuerySchema, resolveProfitLossRange } from "@/modules/profit-loss/validators/profit-loss";

export const GET = withErrorHandler(async (request: Request) => {
  const url = new URL(request.url);
  const parsed = validateQuery(profitLossQuerySchema, Object.fromEntries(url.searchParams.entries()));

  if (!parsed.success) {
    return validationErrorResponse(parsed.message, parsed.errors);
  }

  const range = resolveProfitLossRange(parsed.data);
  if (!range.success) {
    return validationErrorResponse(range.message, range.errors);
  }

  const result = await getProfitLossSummaryService({ fromYm: range.fromYm, toYm: range.toYm });
  return successResponse({ from_ym: range.fromYm, to_ym: range.toYm, ...result });
});
