export type CredentialSourceType = "MANUAL" | "MASTER";

export type AccountDetailItem = {
  authorityCode: string | null;
  typeCode: string | null;
  loginTypeCode: string | null;
  idSourceType: CredentialSourceType;
  idMasterId: number | null;
  loginId: string | null;
  passwordSourceType: CredentialSourceType;
  passwordMasterId: number | null;
  password: string;
  employeeId: number | null;
  isPersonal: boolean;
  visibility: { canDecryptCredential: boolean; canCopyCredential: boolean };
};

export type AccountItem = {
  id: number;
  url: string;
  title: string;
  tagsJson: string[] | null;
  details: AccountDetailItem[];
};
