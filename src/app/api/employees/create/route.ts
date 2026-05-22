import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateBody } from "@/lib/validation";
import { requireManagementAuth } from "@/modules/auth/helpers/auth";
import { createEmployeeService } from "@/modules/employee/services/create-employee";
import { createEmployeeSchema, validateCreateEmployeeBusiness } from "@/modules/employee/validators/create-employee";

export const POST = withErrorHandler(async (request: Request) => {
  const body = await request.json();
  const parsed = validateBody(createEmployeeSchema, body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.message, parsed.errors);
  }

  const business = validateCreateEmployeeBusiness(parsed.data);
  if (!business.success) {
    return validationErrorResponse(business.message, business.errors);
  }

  const user = await requireManagementAuth();
  const created = await createEmployeeService(parsed.data, user.id);

  return successResponse(created, "인원이 생성되었습니다.", 201);
});
