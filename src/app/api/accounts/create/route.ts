import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateBody } from "@/lib/validation";
import { requireManagementAuth } from "@/modules/auth/helpers/auth";
import { createAccountService } from "@/modules/account/services/create-account";
import { createAccountSchema, validateAccountDetailsBusiness } from "@/modules/account/validators/upsert-account";

export const POST = withErrorHandler(async (request: Request) => {
  const body = await request.json();
  const parsed = validateBody(createAccountSchema, body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.message, parsed.errors);
  }

  const business = validateAccountDetailsBusiness(parsed.data.details);
  if (!business.success) {
    return validationErrorResponse(business.message, business.errors);
  }

  const user = await requireManagementAuth();
  const created = await createAccountService(parsed.data, user.id);

  return successResponse(created, "계정이 생성되었습니다.", 201);
});
