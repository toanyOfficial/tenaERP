export const AUTHORITY_CODE = {
  SUPER_ADMIN: "0",
  CEO: "1",
  EXECUTIVE: "2",
  MANAGER: "3",
  STAFF: "4",
  PUBLIC: "99",
} as const;

export type AuthorityCode = (typeof AUTHORITY_CODE)[keyof typeof AUTHORITY_CODE];

export const AUTHORITY_LEVEL: Record<AuthorityCode, number> = {
  [AUTHORITY_CODE.SUPER_ADMIN]: 600,
  [AUTHORITY_CODE.CEO]: 500,
  [AUTHORITY_CODE.EXECUTIVE]: 400,
  [AUTHORITY_CODE.MANAGER]: 300,
  [AUTHORITY_CODE.STAFF]: 200,
  [AUTHORITY_CODE.PUBLIC]: 100,
};
