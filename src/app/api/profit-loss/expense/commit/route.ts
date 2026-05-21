import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateBody } from "@/lib/validation";
import { requireManagementAuth } from "@/modules/auth/helpers/auth";
import { commitExpenseImport } from "@/modules/profit-loss/services/expense-commit";
import { expenseCommitSchema } from "@/modules/profit-loss/validators/expense-commit";

export const POST = withErrorHandler(async (request: Request) => {
  const parsed = validateBody(expenseCommitSchema, await request.json());
  if (!parsed.success) {
    return validationErrorResponse(parsed.message, parsed.errors);
  }

  const user = await requireManagementAuth();
  const data = await commitExpenseImport(parsed.data, user.id);
  return successResponse(data);
});
