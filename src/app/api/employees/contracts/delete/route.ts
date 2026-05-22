import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { validateBody } from "@/lib/validation";
import { requireManagementAuth } from "@/modules/auth/helpers/auth";
import { deleteEmployeeContractFile } from "@/modules/employee/services/contract-file";
import { deleteContractFileSchema } from "@/modules/employee/validators/contract-file";

export const DELETE = withErrorHandler(async (request: Request) => {
  const body = await request.json();
  const parsed = validateBody(deleteContractFileSchema, body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.message, parsed.errors);
  }

  const user = await requireManagementAuth();
  const deleted = await deleteEmployeeContractFile({
    contractId: parsed.data.contractId,
    actorId: user.id,
    actorAuthorityCode: user.authorityCode,
  });

  return successResponse(deleted, "계약서 파일이 삭제되었습니다.");
});
