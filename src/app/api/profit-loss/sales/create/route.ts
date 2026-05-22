import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateBody } from "@/lib/validation";
import { requireManagementAuth } from "@/modules/auth/helpers/auth";
import { createSalesService } from "@/modules/profit-loss/services/sales-upsert";
import { createSalesSchema, validateSalesBusiness } from "@/modules/profit-loss/validators/sales-upsert";

export const POST = withErrorHandler(async (request: Request) => {
  const parsed = validateBody(createSalesSchema, await request.json());
  if (!parsed.success) {
    return validationErrorResponse(parsed.message, parsed.errors);
  }

  const business = validateSalesBusiness(parsed.data.amount);
  if (!business.success) {
    return validationErrorResponse(business.message, business.errors);
  }

  const user = await requireManagementAuth();
  const created = await createSalesService(parsed.data, user.id);
  return successResponse(created, "매출이 등록되었습니다.", 201);
});
