import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateBody } from "@/lib/validation";
import { requireManagementAuth } from "@/modules/auth/helpers/auth";
import { createPasswordMasterService, listPasswordMasterOptionsService, updatePasswordMasterService } from "@/modules/account/services/account-master";
import { passwordMasterCreateSchema, passwordMasterUpdateSchema } from "@/modules/account/validators/account-master";

export const POST = withErrorHandler(async (request: Request) => {
  const parsed = validateBody(passwordMasterCreateSchema, await request.json());
  if (!parsed.success) return validationErrorResponse(parsed.message, parsed.errors);
  const user = await requireManagementAuth();
  return successResponse(await createPasswordMasterService(parsed.data, user.id), "비밀번호마스터가 생성되었습니다.", 201);
});

export const PATCH = withErrorHandler(async (request: Request) => {
  const parsed = validateBody(passwordMasterUpdateSchema, await request.json());
  if (!parsed.success) return validationErrorResponse(parsed.message, parsed.errors);
  const user = await requireManagementAuth();
  return successResponse(await updatePasswordMasterService(parsed.data, user.id), "비밀번호마스터가 수정되었습니다.");
});


export const GET = withErrorHandler(async () => {
  await requireManagementAuth();
  return successResponse(await listPasswordMasterOptionsService());
});
