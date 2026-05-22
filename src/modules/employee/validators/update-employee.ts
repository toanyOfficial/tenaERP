import { z } from "zod";
import { validatePasswordPolicy } from "@/modules/auth/validators/password";

const optionalString = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const contractSchema = z.object({
  id: z.number().int().optional(),
  writtenDate: z.string().trim().optional().or(z.literal("")),
  contractStartDate: z.string().trim().min(1, "계약 시작일자를 입력해주세요."),
  contractEndDate: z.string().trim().optional().or(z.literal("")),
  annualSalary: z.number().nullable().optional(),
  filePath: z.string().nullable().optional(),
  isNew: z.boolean().optional(),
});

export const updateEmployeeSchema = z
  .object({
    phone: optionalString(50),
    email: z.string().trim().email("유효한 이메일 형식이 아닙니다.").max(255).optional().or(z.literal("")),
    address: optionalString(500),
    bankName: optionalString(100),
    bankAccountNo: optionalString(255),
    departmentCode: optionalString(100),
    positionCode: optionalString(100),
    authorityCode: optionalString(100),
    password: z.string().optional(),
    residentRegistrationNoFront: z.string().trim().regex(/^\d{6}$/, "주민번호 앞자리는 6자리 숫자여야 합니다.").optional(),
    residentRegistrationNoBack: z.string().trim().regex(/^\d{7}$/, "주민번호 뒷자리는 7자리 숫자여야 합니다.").optional(),
    contracts: z.array(contractSchema).optional(),
  })
  .strict();

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

const updatableFields: Array<keyof UpdateEmployeeInput> = [
  "phone",
  "email",
  "address",
  "bankName",
  "bankAccountNo",
  "departmentCode",
  "positionCode",
  "authorityCode",
  "password",
  "residentRegistrationNoFront",
  "residentRegistrationNoBack",
  "contracts",
];

export function validateUpdateEmployeeBusiness(input: UpdateEmployeeInput) {
  const requestedKeys = updatableFields.filter((key) => input[key] !== undefined);

  if (requestedKeys.length === 0) {
    return {
      success: false as const,
      message: "수정할 항목이 없습니다.",
      errors: [{ field: "body", message: "최소 1개 이상의 수정 항목이 필요합니다." }],
    };
  }

  if ((input.residentRegistrationNoFront && !input.residentRegistrationNoBack) || (!input.residentRegistrationNoFront && input.residentRegistrationNoBack)) {
    return {
      success: false as const,
      message: "주민번호 수정 시 앞/뒷자리를 모두 입력해야 합니다.",
      errors: [
        { field: "residentRegistrationNoFront", message: "주민번호 앞/뒷자리를 함께 입력해주세요." },
        { field: "residentRegistrationNoBack", message: "주민번호 앞/뒷자리를 함께 입력해주세요." },
      ],
    };
  }

  if (input.password !== undefined) {
    if (!input.password.trim()) {
      return {
        success: false as const,
        message: "비밀번호는 빈 값으로 수정할 수 없습니다.",
        errors: [{ field: "password", message: "비밀번호를 입력해주세요." }],
      };
    }

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
  }

  return { success: true as const };
}
