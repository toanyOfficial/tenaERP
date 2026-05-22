export type CredentialSourceType = "MANUAL" | "MASTER";

export type AccountDetailItem = {
  id?: number;
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

export type IdMasterOption = {
  id: number;
  title: string;
  loginId: string;
  useYn: "Y" | "N";
};

export type PasswordMasterOption = {
  id: number;
  title: string;
  authorityCode: string | null;
  useYn: "Y" | "N";
};
