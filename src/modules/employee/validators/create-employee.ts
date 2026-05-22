import { z } from "zod";
import { validatePasswordPolicy } from "@/modules/auth/validators/password";

const optionalText = z.string().trim().optional().or(z.literal(""));
const contractSchema = z.object({
  id: z.number().int().optional(),
  writtenDate: optionalText,
  contractStartDate: z.string().trim().min(1, "계약 시작일자를 입력해주세요."),
  contractEndDate: optionalText,
  annualSalary: z.number().nullable().optional(),
  filePath: z.string().nullable().optional(),
  isNew: z.boolean().optional(),
});

export const createEmployeeSchema = z.object({
  name: z.string().trim().min(1, "이름은 필수입니다.").max(100),
  englishName: z.string().trim().min(1, "영문명은 필수입니다.").max(100),
  nickname: optionalText,
  phone: z.string().trim().regex(/^[0-9-]{8,20}$/, "연락처 형식을 확인해주세요."),
  email: optionalText.refine((value) => !value || z.string().email().safeParse(value).success, "유효한 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호는 필수입니다."),
  residentRegistrationNoFront: z.string().trim().regex(/^\d{6}$/, "주민번호 앞자리는 6자리 숫자여야 합니다."),
  residentRegistrationNoBack: z.string().trim().regex(/^\d{7}$/, "주민번호 뒷자리는 7자리 숫자여야 합니다."),
  departmentCode: optionalText,
  positionCode: optionalText,
  authorityCode: z.string().trim().min(1, "권한은 필수입니다.").max(100),
  bankName: optionalText,
  bankAccountNo: optionalText,
  address: optionalText,
  joinDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "입사일자를 확인해주세요."),
  resignDate: optionalText.refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), "퇴사일자를 확인해주세요."),
  contracts: z.array(contractSchema).optional(),
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
