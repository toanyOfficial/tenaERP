import { withErrorHandler, successResponse, validationErrorResponse } from "@/lib/api";
import { validateQuery } from "@/lib/validation";
import { listEmployeesService } from "@/modules/employee/services/list-employees";
import { listEmployeesQuerySchema } from "@/modules/employee/validators/list-employees";

export const GET = withErrorHandler(async (request: Request) => {
  const url = new URL(request.url);
  const validation = validateQuery(listEmployeesQuerySchema, Object.fromEntries(url.searchParams.entries()));

  if (!validation.success) {
    return validationErrorResponse(validation.message, validation.errors);
  }

  const result = await listEmployeesService(validation.data);
  return successResponse(result);
});
