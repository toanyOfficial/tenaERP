import { z } from "zod";

export const uploadContractFileSchema = z.object({
  contractId: z.coerce.number().int().positive("유효한 계약서 ID가 필요합니다."),
});

export const deleteContractFileSchema = z.object({
  contractId: z.coerce.number().int().positive("유효한 계약서 ID가 필요합니다."),
});

export type UploadContractFileInput = z.infer<typeof uploadContractFileSchema>;
export type DeleteContractFileInput = z.infer<typeof deleteContractFileSchema>;
