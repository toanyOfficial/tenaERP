import { z } from "zod";
import { validatePasswordPolicy } from "@/modules/auth/validators/password";

export const createEmployeeSchema = z.object({
  name: z.string().trim().min(1, "이름은 필수입니다.").max(100),
  englishName: z.string().trim().max(100).optional().or(z.literal("")),
  nickname: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().min(1, "연락처는 필수입니다.").max(50),
  email: z.string().trim().email("유효한 이메일 형식이 아닙니다.").max(255),
  password: z.string().min(1, "비밀번호는 필수입니다."),
  residentRegistrationNoFront: z.string().trim().regex(/^\d{6}$/, "주민번호 앞자리는 6자리 숫자여야 합니다."),
  residentRegistrationNoBack: z.string().trim().regex(/^\d{7}$/, "주민번호 뒷자리는 7자리 숫자여야 합니다."),
  departmentCode: z.string().trim().max(100).optional().or(z.literal("")),
  positionCode: z.string().trim().max(100).optional().or(z.literal("")),
  authorityCode: z.string().trim().max(100).optional().or(z.literal("")),
  bankName: z.string().trim().max(100).optional().or(z.literal("")),
  bankAccountNo: z.string().trim().max(255).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export function validateCreateEmployeeBusiness(input: CreateEmployeeInput) {
  const passwordResult = validatePasswordPolicy(input.password);
  if (!passwordResult.valid) {
    return {
      success: false as const,
      message: passwordResult.messages[0] ?? "비밀번호 정책을 확인해주세요.",
      errors: passwordResult.items
        .filter((item) => !item.valid)
        .map((item) => ({ field: "password", message: item.message, reason: item.rule })),
    };
  }

  return { success: true as const };
}
