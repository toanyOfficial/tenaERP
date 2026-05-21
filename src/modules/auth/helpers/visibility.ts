import {
  canViewContract,
  canViewCredentialPassword,
  canViewResidentRegistration,
  canViewSalary,
} from "@/modules/auth/helpers/authority";
import type { LoginSuccessUser } from "@/modules/auth/types";
import { maskBankAccount, maskPassword, maskResidentRegistration } from "@/utils/masking";

export type SensitiveVisibility = {
  canViewSalary: boolean;
  canViewResidentRegistration: boolean;
  canViewContract: boolean;
  canViewCredentialPassword: boolean;
};

export function getSensitiveVisibility(user: LoginSuccessUser | null): SensitiveVisibility {
  const authorityCode = user?.authorityCode;

  return {
    canViewSalary: canViewSalary(authorityCode),
    canViewResidentRegistration: canViewResidentRegistration(authorityCode),
    canViewContract: canViewContract(authorityCode),
    canViewCredentialPassword: canViewCredentialPassword(authorityCode),
  };
}

export function toVisibleResidentRegistrationBack(user: LoginSuccessUser | null, decryptedValue: string | null) {
  if (!decryptedValue) return null;
  return canViewResidentRegistration(user?.authorityCode) ? decryptedValue : maskResidentRegistration(decryptedValue);
}

export function toVisibleSalary(user: LoginSuccessUser | null, salary: number | null) {
  if (salary === null) return null;
  return canViewSalary(user?.authorityCode) ? salary : null;
}

export function toVisibleCredentialPassword(user: LoginSuccessUser | null, decryptedValue: string | null) {
  if (!decryptedValue) return null;
  return canViewCredentialPassword(user?.authorityCode) ? decryptedValue : maskPassword(decryptedValue);
}

export function toVisibleBankCredential(user: LoginSuccessUser | null, plainAccountNo: string | null) {
  if (!plainAccountNo) return null;
  return canViewCredentialPassword(user?.authorityCode) ? plainAccountNo : maskBankAccount(plainAccountNo);
}
