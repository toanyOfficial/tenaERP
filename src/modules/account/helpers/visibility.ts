import { canViewCredentialPassword } from "@/modules/auth/helpers/authority";
import type { LoginSuccessUser } from "@/modules/auth/types";
import { maskPassword } from "@/utils/masking";

export function canViewCredential(user: LoginSuccessUser | null) {
  return !!user;
}

export function canDecryptCredential(user: LoginSuccessUser | null) {
  return canViewCredentialPassword(user?.authorityCode);
}

export function canCopyCredential(user: LoginSuccessUser | null) {
  return canViewCredentialPassword(user?.authorityCode);
}

export function toVisibleCredentialPasswordForAccount(user: LoginSuccessUser | null, encryptedPassword: string | null, decrypt: (v: string) => string) {
  if (!encryptedPassword) return "";
  if (!canDecryptCredential(user)) return maskPassword("********");
  return maskPassword(decrypt(encryptedPassword));
}
