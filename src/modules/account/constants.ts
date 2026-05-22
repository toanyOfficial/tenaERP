export const ACCOUNT_TYPE_CODE = {
  BUSINESS: "1",
  CEO: "2",
  PERSONAL: "3",
} as const;

export const LOGIN_TYPE_CODE = {
  ID_PASSWORD: "1",
  CERTIFICATE: "2",
  PHONE_AUTH: "3",
  GMAIL_SSO: "4",
  KAKAO_SSO: "5",
  NAVER_SSO: "6",
} as const;

export const CREDENTIAL_SOURCE_TYPE = {
  MANUAL: "1",
  MASTER: "2",
} as const;

export const AUTHORITY_CODE = {
  SUPER_ADMIN: "0",
  CEO: "1",
  EXECUTIVE: "2",
  MANAGER: "3",
  STAFF: "4",
  PUBLIC: "99",
} as const;

export type AccountTypeCode = (typeof ACCOUNT_TYPE_CODE)[keyof typeof ACCOUNT_TYPE_CODE];
export type LoginTypeCode = (typeof LOGIN_TYPE_CODE)[keyof typeof LOGIN_TYPE_CODE];
export type CredentialSourceType = (typeof CREDENTIAL_SOURCE_TYPE)[keyof typeof CREDENTIAL_SOURCE_TYPE];
export type AuthorityCode = (typeof AUTHORITY_CODE)[keyof typeof AUTHORITY_CODE];
