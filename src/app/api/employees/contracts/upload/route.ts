import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { requireAuth } from "@/modules/auth/helpers/auth";
import { uploadEmployeeContractFile } from "@/modules/employee/services/contract-file";
import { uploadContractFileSchema } from "@/modules/employee/validators/contract-file";

export const POST = withErrorHandler(async (request: Request) => {
  const formData = await request.formData();
  const contractIdValue = formData.get("contractId");
  const fileValue = formData.get("file");

  const parsed = uploadContractFileSchema.safeParse({ contractId: contractIdValue });
  if (!parsed.success) {
    return validationErrorResponse("입력값이 올바르지 않습니다.", [
      { field: "contractId", message: "유효한 계약서 ID가 필요합니다." },
    ]);
  }

  if (!(fileValue instanceof File)) {
    return validationErrorResponse("파일이 필요합니다.", [{ field: "file", message: "업로드할 PDF 파일을 선택해주세요." }]);
  }

  const user = await requireAuth();
  const uploaded = await uploadEmployeeContractFile({
    contractId: parsed.data.contractId,
    file: fileValue,
    actorId: user.id,
    actorAuthorityCode: user.authorityCode,
  });

  return successResponse(uploaded, "계약서 파일이 업로드되었습니다.");
});
