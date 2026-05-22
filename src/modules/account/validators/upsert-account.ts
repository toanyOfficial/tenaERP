import { z } from "zod";
import { ACCOUNT_TYPE_CODE, CREDENTIAL_SOURCE_TYPE, LOGIN_TYPE_CODE } from "@/modules/account/constants";

const accountTypeCodeSchema = z.enum([
  ACCOUNT_TYPE_CODE.BUSINESS,
  ACCOUNT_TYPE_CODE.CEO,
  ACCOUNT_TYPE_CODE.PERSONAL,
]);

const loginTypeCodeSchema = z.enum([
  LOGIN_TYPE_CODE.ID_PASSWORD,
  LOGIN_TYPE_CODE.CERTIFICATE,
  LOGIN_TYPE_CODE.PHONE_AUTH,
  LOGIN_TYPE_CODE.GMAIL_SSO,
  LOGIN_TYPE_CODE.KAKAO_SSO,
  LOGIN_TYPE_CODE.NAVER_SSO,
]);

const credentialSourceTypeSchema = z.enum([
  CREDENTIAL_SOURCE_TYPE.MANUAL,
  CREDENTIAL_SOURCE_TYPE.MASTER,
]);

const accountDetailSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  typeCode: accountTypeCodeSchema.optional(),
  loginTypeCode: loginTypeCodeSchema.optional(),
  idSourceType: credentialSourceTypeSchema.optional().default(CREDENTIAL_SOURCE_TYPE.MANUAL),
  idMasterId: z.coerce.number().int().positive().optional().nullable(),
  loginId: z.string().trim().max(255).optional().or(z.literal("")),
  passwordSourceType: credentialSourceTypeSchema.optional().default(CREDENTIAL_SOURCE_TYPE.MANUAL),
  passwordMasterId: z.coerce.number().int().positive().optional().nullable(),
  password: z.string().optional(),
  authorityCode: z.enum(["0", "1", "2", "3", "4", "99"]).optional(),
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

export function validateAccountDetailsBusiness(
  details: Array<z.infer<typeof accountDetailSchema>>,
  options?: { isUpdate?: boolean },
) {
  const errors: Array<{ field: string; message: string }> = [];

  details.forEach((detail, index) => {
    if (detail.loginTypeCode !== LOGIN_TYPE_CODE.ID_PASSWORD) {
      return;
    }

    const idSourceType = detail.idSourceType ?? CREDENTIAL_SOURCE_TYPE.MANUAL;
    const passwordSourceType = detail.passwordSourceType ?? CREDENTIAL_SOURCE_TYPE.MANUAL;

    if (idSourceType === CREDENTIAL_SOURCE_TYPE.MANUAL && !detail.loginId?.trim()) {
      errors.push({ field: `details.${index}.loginId`, message: "ID 직접입력 시 로그인 아이디는 필수입니다." });
    }
    if (idSourceType === CREDENTIAL_SOURCE_TYPE.MASTER && !detail.idMasterId) {
      errors.push({ field: `details.${index}.idMasterId`, message: "ID 마스터선택 시 아이디마스터 ID는 필수입니다." });
    }

    if (passwordSourceType === CREDENTIAL_SOURCE_TYPE.MASTER && !detail.passwordMasterId) {
      errors.push({ field: `details.${index}.passwordMasterId`, message: "PW 마스터선택 시 비밀번호마스터 ID는 필수입니다." });
    }

    if (passwordSourceType === CREDENTIAL_SOURCE_TYPE.MANUAL) {
      const hasPasswordInput = Boolean(detail.password?.trim());
      const canKeepExisting = Boolean(options?.isUpdate && detail.id);
      if (!hasPasswordInput && !canKeepExisting) {
        errors.push({ field: `details.${index}.password`, message: "PW 직접입력 시 비밀번호는 필수입니다." });
      }
    }
  });

  if (errors.length > 0) {
    return { success: false as const, message: errors[0]?.message ?? "상세 계정을 확인해주세요.", errors };
  }

  return { success: true as const };
}
