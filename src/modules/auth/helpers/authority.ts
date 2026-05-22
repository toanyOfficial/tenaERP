import { AUTHORITY_CODE, AUTHORITY_LEVEL, type AuthorityCode } from "@/modules/auth/constants/authority";

const AUTHORITY_KEY_MAP: Record<string, AuthorityCode> = {
  "1": AUTHORITY_CODE.CEO,
  "2": AUTHORITY_CODE.EXECUTIVE,
  "3": AUTHORITY_CODE.MANAGER,
  "4": AUTHORITY_CODE.STAFF,
};

export function normalizeAuthorityCode(authorityCode: string | null | undefined): AuthorityCode | null {
  if (!authorityCode) return null;

  const normalized = authorityCode.trim().toUpperCase();
  if (!normalized) return null;

  if (normalized in AUTHORITY_KEY_MAP) {
    return AUTHORITY_KEY_MAP[normalized];
  }

  if (normalized in AUTHORITY_LEVEL) {
    return normalized as AuthorityCode;
  }

  return null;
}

export function getAuthorityLevel(authorityCode: string | null | undefined): number {
  const normalized = normalizeAuthorityCode(authorityCode);
  if (!normalized) return 0;
  return AUTHORITY_LEVEL[normalized] ?? 0;
}

export function hasAuthority(
  currentAuthorityCode: string | null | undefined,
  minimumAuthorityCode: AuthorityCode,
): boolean {
  return getAuthorityLevel(currentAuthorityCode) >= AUTHORITY_LEVEL[minimumAuthorityCode];
}

export function isSuperAdmin(authorityCode: string | null | undefined): boolean {
  return normalizeAuthorityCode(authorityCode) === AUTHORITY_CODE.SUPER_ADMIN;
}

export function isCeoOrHigher(authorityCode: string | null | undefined): boolean {
  return hasAuthority(authorityCode, AUTHORITY_CODE.CEO);
}

export function isExecutive(authorityCode: string | null | undefined): boolean {
  return hasAuthority(authorityCode, AUTHORITY_CODE.EXECUTIVE);
}

export function isAdmin(authorityCode: string | null | undefined): boolean {
  return isSuperAdmin(authorityCode);
}

export function canAccessManagementScreen(authorityCode: string | null | undefined): boolean {
  return hasAuthority(authorityCode, AUTHORITY_CODE.MANAGER);
}

export function canViewSalary(authorityCode: string | null | undefined): boolean {
  return hasAuthority(authorityCode, AUTHORITY_CODE.MANAGER);
}

export function canViewResidentRegistration(authorityCode: string | null | undefined): boolean {
  return isExecutive(authorityCode);
}

export function canViewCredentialPassword(authorityCode: string | null | undefined): boolean {
  return isSuperAdmin(authorityCode);
}

export function canViewContract(authorityCode: string | null | undefined): boolean {
  return isExecutive(authorityCode);
}
