import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateQuery } from "@/lib/validation";
import { requireManagementAuth } from "@/modules/auth/helpers/auth";
import { listBaseCodesByGroups } from "@/modules/base-code/services/list-base-codes";
import { listBaseCodesQuerySchema } from "@/modules/base-code/validators/list-base-codes";

export const GET = withErrorHandler(async (request: Request) => {
  await requireManagementAuth();

  const url = new URL(request.url);
  const parsed = validateQuery(listBaseCodesQuerySchema, Object.fromEntries(url.searchParams.entries()));

  if (!parsed.success) {
    return validationErrorResponse(parsed.message, parsed.errors);
  }

  const groups = parsed.data.groups.split(",").map((group) => group.trim()).filter(Boolean);
  if (groups.length === 0) {
    return validationErrorResponse("groups는 필수입니다.", [{ field: "groups", message: "조회할 group을 입력해주세요." }]);
  }

  const data = await listBaseCodesByGroups(groups);
  return successResponse(data);
});
