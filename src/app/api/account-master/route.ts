import { successResponse, withErrorHandler } from "@/lib/api";
import { requireManagementAuth } from "@/modules/auth/helpers/auth";
import { listAccountMasterService } from "@/modules/account/services/account-master";

export const GET = withErrorHandler(async () => {
  await requireManagementAuth();
  const data = await listAccountMasterService();
  return successResponse(data);
});
