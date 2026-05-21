import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { requireAuth } from "@/modules/auth/helpers/auth";
import { getEmployeeDetailService } from "@/modules/employee/services/get-employee-detail";

export const GET = withErrorHandler(async (_request: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const employeeId = Number.parseInt(id, 10);

  if (!Number.isInteger(employeeId) || employeeId <= 0) {
    return validationErrorResponse("입력값이 올바르지 않습니다.", [{ field: "id", message: "유효한 인원 ID가 필요합니다." }]);
  }

  const user = await requireAuth();
  const result = await getEmployeeDetailService({ employeeId, viewerAuthorityCode: user.authorityCode });

  return successResponse(result);
});
