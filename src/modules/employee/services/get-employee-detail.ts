import { decrypt } from "@/lib/crypto/aes";
import { NotFoundApiError } from "@/lib/api";
import { getEmployeeDetailQuery } from "@/modules/employee/queries/get-employee-detail";
import { canViewContract, canViewResidentRegistration, canViewSalary } from "@/modules/auth/helpers/authority";
import { maskResidentRegistration } from "@/utils/masking";

export async function getEmployeeDetailService(params: { employeeId: number; viewerAuthorityCode: string | null }) {
  const data = await getEmployeeDetailQuery(params.employeeId);
  if (!data) throw new NotFoundApiError("인원 정보를 찾을 수 없습니다.");

  const canViewRrn = canViewResidentRegistration(params.viewerAuthorityCode);
  const canViewContractInfo = canViewContract(params.viewerAuthorityCode);
  const canViewSalaryInfo = canViewSalary(params.viewerAuthorityCode);

  const residentRegistrationNoBack = (() => {
    if (!data.employee.residentRegistrationNoBackEnc) return null;
    if (!canViewRrn) return null;
    const decrypted = decrypt(data.employee.residentRegistrationNoBackEnc);
    return maskResidentRegistration(decrypted);
  })();

  return {
    employee: {
      id: data.employee.id,
      name: data.employee.name,
      englishName: data.employee.englishName,
      nickname: data.employee.nickname,
      phone: data.employee.phone,
      email: data.employee.email,
      address: data.employee.address,
      bankName: data.employee.bankName,
      bankAccountNo: data.employee.bankAccountNo,
      departmentCode: data.employee.departmentCode,
      positionCode: data.employee.positionCode,
      authorityCode: data.employee.authorityCode,
      residentRegistrationNoFront: data.employee.residentRegistrationNoFront,
      residentRegistrationNoBack,
    },
    contracts: data.contracts.map((contract) => ({
      id: contract.id,
      writtenDate: contract.writtenDate,
      contractStartDate: contract.contractStartDate,
      contractEndDate: contract.contractEndDate,
      annualSalary: canViewSalaryInfo ? contract.annualSalary : null,
      filePath: canViewContractInfo ? contract.filePath : null,
    })),
  };
}
