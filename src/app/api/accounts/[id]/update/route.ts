import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateBody } from "@/lib/validation";
import { requireManagementAuth } from "@/modules/auth/helpers/auth";
import { updateAccountService } from "@/modules/account/services/update-account";
import { updateAccountSchema, validateAccountDetailsBusiness } from "@/modules/account/validators/upsert-account";

export const PATCH = withErrorHandler(async (request: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const accountId = Number.parseInt(id, 10);

  if (!Number.isInteger(accountId) || accountId <= 0) {
    return validationErrorResponse("입력값이 올바르지 않습니다.", [{ field: "id", message: "유효한 계정 ID가 필요합니다." }]);
  }

  const body = await request.json();
  const parsed = validateBody(updateAccountSchema, body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.message, parsed.errors);
  }

  if (parsed.data.details) {
    const business = validateAccountDetailsBusiness(parsed.data.details, { isUpdate: true });
    if (!business.success) {
      return validationErrorResponse(business.message, business.errors);
    }
  }

  const user = await requireManagementAuth();
  const updated = await updateAccountService(accountId, parsed.data, user.id);

  return successResponse(updated, "계정이 수정되었습니다.");
});
