import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateBody } from "@/lib/validation";
import { requireManagementAuth } from "@/modules/auth/helpers/auth";
import { updateEmployeeService } from "@/modules/employee/services/update-employee";
import { updateEmployeeSchema, validateUpdateEmployeeBusiness } from "@/modules/employee/validators/update-employee";

export const PATCH = withErrorHandler(async (request: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const employeeId = Number.parseInt(id, 10);

  if (!Number.isInteger(employeeId) || employeeId <= 0) {
    return validationErrorResponse("입력값이 올바르지 않습니다.", [{ field: "id", message: "유효한 인원 ID가 필요합니다." }]);
  }

  const body = await request.json();
  const parsed = validateBody(updateEmployeeSchema, body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.message, parsed.errors);
  }

  const business = validateUpdateEmployeeBusiness(parsed.data);
  if (!business.success) {
    return validationErrorResponse(business.message, business.errors);
  }

  const user = await requireManagementAuth();

  const updated = await updateEmployeeService({
    employeeId,
    actorId: user.id,
    actorAuthorityCode: user.authorityCode,
    input: parsed.data,
  });

  return successResponse(updated, "인원 정보가 수정되었습니다.");
});
