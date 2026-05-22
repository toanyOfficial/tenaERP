export type EmployeeListRow = {
  id: number;
  employeeNo: string;
  name: string;
  nickname: string | null;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  bankName: string | null;
  bankAccountNo: string | null;
  address: string | null;
  employmentStatus: "EMPLOYED" | "RESIGNED";
  updatedAt: string;
};

export type EmployeeDetail = {
  employee: {
    id: number;
    name: string;
    englishName: string | null;
    nickname: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    bankName: string | null;
    bankAccountNo: string | null;
    departmentCode: string | null;
    positionCode: string | null;
    authorityCode: string | null;
    joinDate: string | null;
    resignDate: string | null;
    residentRegistrationNoFront: string | null;
    residentRegistrationNoBack: string | null;
  };
  contracts: Array<{
    id: number;
    writtenDate: string | null;
    contractStartDate: string;
    contractEndDate: string | null;
    annualSalary: number | null;
    filePath: string | null;
    isNew?: boolean;
  }>;
};
