export type CredentialSourceType = "1" | "2";

export type AccountDetailItem = {
  id?: number;
  authorityCode: string | null;
  authorityLabel?: string | null;
  typeCode: string | null;
  typeLabel?: string | null;
  loginTypeCode: string | null;
  loginTypeLabel?: string | null;
  idSourceType: CredentialSourceType;
  idSourceLabel?: string | null;
  idMasterId: number | null;
  loginId: string | null;
  passwordSourceType: CredentialSourceType;
  passwordSourceLabel?: string | null;
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
  authorityLabel?: string | null;
  useYn: "Y" | "N";
};
