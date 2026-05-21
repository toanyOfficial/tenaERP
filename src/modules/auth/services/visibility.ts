import type { LoginSuccessUser } from "@/modules/auth/types";
import {
  getSensitiveVisibility,
  toVisibleBankCredential,
  toVisibleCredentialPassword,
  toVisibleResidentRegistrationBack,
  toVisibleSalary,
} from "@/modules/auth/helpers/visibility";

export type SensitivePayload = {
  residentRegistrationNoBack?: string | null;
  annualSalary?: number | null;
  credentialPassword?: string | null;
  bankAccountNo?: string | null;
};

export function applySensitiveVisibility(user: LoginSuccessUser | null, payload: SensitivePayload) {
  return {
    visibility: getSensitiveVisibility(user),
    residentRegistrationNoBack: toVisibleResidentRegistrationBack(user, payload.residentRegistrationNoBack ?? null),
    annualSalary: toVisibleSalary(user, payload.annualSalary ?? null),
    credentialPassword: toVisibleCredentialPassword(user, payload.credentialPassword ?? null),
    bankAccountNo: toVisibleBankCredential(user, payload.bankAccountNo ?? null),
  };
}
