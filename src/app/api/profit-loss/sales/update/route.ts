import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateBody } from "@/lib/validation";
import { requireAuth } from "@/modules/auth/helpers/auth";
import { updateSalesService } from "@/modules/profit-loss/services/sales-upsert";
import { updateSalesSchema, validateSalesBusiness } from "@/modules/profit-loss/validators/sales-upsert";

export const PATCH = withErrorHandler(async (request: Request) => {
  const parsed = validateBody(updateSalesSchema, await request.json());
  if (!parsed.success) {
    return validationErrorResponse(parsed.message, parsed.errors);
  }

  if (parsed.data.amount !== undefined) {
    const business = validateSalesBusiness(parsed.data.amount);
    if (!business.success) {
      return validationErrorResponse(business.message, business.errors);
    }
  }

  const user = await requireAuth();
  const updated = await updateSalesService(parsed.data, user.id);
  return successResponse(updated, "매출이 수정되었습니다.");
});
