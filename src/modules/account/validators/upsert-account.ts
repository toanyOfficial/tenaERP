import { z } from "zod";

const accountDetailSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  typeCode: z.string().trim().max(100).optional().or(z.literal("")),
  loginTypeCode: z.string().trim().max(100).optional().or(z.literal("")),
  loginId: z.string().trim().max(255).optional().or(z.literal("")),
  password: z.string().optional(),
  authorityCode: z.string().trim().max(100).optional().or(z.literal("")),
  employeeId: z.coerce.number().int().positive().optional().nullable(),
});

export const createAccountSchema = z.object({
  url: z.string().trim().min(1, "URL은 필수입니다.").max(1000),
  title: z.string().trim().min(1, "제목은 필수입니다.").max(255),
  tagsJson: z.array(z.string().trim().max(100)).optional(),
  details: z.array(accountDetailSchema).min(1, "최소 1개 이상의 상세 계정이 필요합니다."),
}).strict();

export const updateAccountSchema = z.object({
  url: z.string().trim().min(1).max(1000).optional(),
  title: z.string().trim().min(1).max(255).optional(),
  tagsJson: z.array(z.string().trim().max(100)).optional(),
  details: z.array(accountDetailSchema).optional(),
}).strict();

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

export function validateAccountDetailsBusiness(details: Array<z.infer<typeof accountDetailSchema>>) {
  const errors: Array<{ field: string; message: string }> = [];

  details.forEach((detail, index) => {
    if (!detail.loginId?.trim()) errors.push({ field: `details.${index}.loginId`, message: "로그인 아이디는 필수입니다." });
    if (!detail.password?.trim()) errors.push({ field: `details.${index}.password`, message: "비밀번호는 필수입니다." });
  });

  if (errors.length > 0) {
    return { success: false as const, message: errors[0]?.message ?? "상세 계정을 확인해주세요.", errors };
  }

  return { success: true as const };
}
