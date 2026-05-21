import { successResponse, withErrorHandler } from "@/lib/api";
import { requireAuth } from "@/modules/auth/helpers/auth";
import { listAccountMasterService } from "@/modules/account/services/account-master";

export const GET = withErrorHandler(async () => {
  await requireAuth();
  const data = await listAccountMasterService();
  return successResponse(data);
});
