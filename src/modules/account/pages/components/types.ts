export type AccountDetailItem = {
  authorityCode: string | null;
  typeCode: string | null;
  loginTypeCode: string | null;
  loginId: string | null;
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
