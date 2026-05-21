import { AUTHORITY_CODE, AUTHORITY_LEVEL, type AuthorityCode } from "@/modules/auth/constants/authority";

function toAuthorityLevel(authorityCode: string | null | undefined): number {
  if (!authorityCode) {
    return 0;
  }

  return AUTHORITY_LEVEL[authorityCode as AuthorityCode] ?? 0;
}

export function hasAuthority(
  currentAuthorityCode: string | null | undefined,
  minimumAuthorityCode: AuthorityCode,
): boolean {
  return toAuthorityLevel(currentAuthorityCode) >= AUTHORITY_LEVEL[minimumAuthorityCode];
}

export function isExecutive(authorityCode: string | null | undefined): boolean {
  return hasAuthority(authorityCode, AUTHORITY_CODE.EXECUTIVE);
}

export function isAdmin(authorityCode: string | null | undefined): boolean {
  return hasAuthority(authorityCode, AUTHORITY_CODE.SUPER_ADMIN);
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
  return isAdmin(authorityCode);
}

export function canViewContract(authorityCode: string | null | undefined): boolean {
  return isExecutive(authorityCode);
}
