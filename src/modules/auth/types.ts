export type SessionPayload = {
  employeeId: number;
  employeeNo: string;
  exp: number;
};

export type LoginSuccessUser = {
  id: number;
  employeeNo: string;
  name: string;
  authorityCode: string | null;
};
