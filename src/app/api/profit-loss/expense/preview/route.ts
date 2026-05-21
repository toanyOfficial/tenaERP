import { successResponse, validationErrorResponse, withErrorHandler } from "@/lib/api";
import { requireAuth } from "@/modules/auth/helpers/auth";
import { buildExpensePreview } from "@/modules/profit-loss/services/expense-preview";

export const POST = withErrorHandler(async (request: Request) => {
  await requireAuth();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return validationErrorResponse("파일이 필요합니다.", [{ field: "file", message: "preview 파일을 업로드해주세요." }]);
  }

  const text = await file.text();
  if (!text.trim()) {
    return validationErrorResponse("파일 내용이 비어있습니다.", [{ field: "file", message: "preview할 데이터가 없습니다." }]);
  }

  const result = await buildExpensePreview(text);
  return successResponse(result, "지출 preview가 생성되었습니다.");
});
