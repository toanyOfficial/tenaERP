import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateBody } from "@/lib/validation";
import { requireManagementAuth } from "@/modules/auth/helpers/auth";
import { createIdMasterService, listIdMasterOptionsService, updateIdMasterService } from "@/modules/account/services/account-master";
import { idMasterCreateSchema, idMasterUpdateSchema } from "@/modules/account/validators/account-master";

export const POST = withErrorHandler(async (request: Request) => {
  const parsed = validateBody(idMasterCreateSchema, await request.json());
  if (!parsed.success) return validationErrorResponse(parsed.message, parsed.errors);
  const user = await requireManagementAuth();
  return successResponse(await createIdMasterService(parsed.data, user.id), "아이디마스터가 생성되었습니다.", 201);
});

export const PATCH = withErrorHandler(async (request: Request) => {
  const parsed = validateBody(idMasterUpdateSchema, await request.json());
  if (!parsed.success) return validationErrorResponse(parsed.message, parsed.errors);
  const user = await requireManagementAuth();
  return successResponse(await updateIdMasterService(parsed.data, user.id), "아이디마스터가 수정되었습니다.");
});


export const GET = withErrorHandler(async () => {
  await requireManagementAuth();
  return successResponse(await listIdMasterOptionsService());
});
