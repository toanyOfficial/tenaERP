import { decrypt } from "@/lib/crypto/aes";
import { createPaginationResponse, parsePagination } from "@/lib/pagination";
import { canCopyCredential, canDecryptCredential } from "@/modules/account/helpers/visibility";
import { maskPassword } from "@/utils/masking";
import type { LoginSuccessUser } from "@/modules/auth/types";
import { getAuthorityLabelMap, listAccountHeadersQuery } from "@/modules/account/queries/list-accounts";
import type { ListAccountsQuery } from "@/modules/account/validators/list-accounts";

const TYPE_LABELS: Record<string, string> = { "1": "사업자", "2": "대표이사", "3": "개인" };
const LOGIN_TYPE_LABELS: Record<string, string> = {
  "1": "아이디비밀번호",
  "2": "공동인증서",
  "3": "휴대폰인증",
  "4": "gmailSSO",
  "5": "카카오톡SSO",
  "6": "네이버SSO",
};
const SOURCE_TYPE_LABELS: Record<string, string> = { "1": "직접입력", "2": "마스터" };

export async function listAccountsService(query: ListAccountsQuery, user: LoginSuccessUser) {
  const pagination = parsePagination({ page: query.page, limit: query.limit });
  const [{ totalCount, headers, details }, authorityLabelMap] = await Promise.all([
    listAccountHeadersQuery({ query, ...pagination }),
    getAuthorityLabelMap(),
  ]);

  const detailsByHeader = new Map<number, typeof details>();
  for (const detail of details) {
    const list = detailsByHeader.get(detail.headerId) ?? [];
    list.push(detail);
    detailsByHeader.set(detail.headerId, list);
  }

  const items = headers.map((header) => {
    const rawDetails = detailsByHeader.get(header.id) ?? [];
    const filtered = query.isPersonal === "Y"
      ? rawDetails.filter((d) => d.employeeId !== null)
      : query.isPersonal === "N"
        ? rawDetails.filter((d) => d.employeeId === null)
        : rawDetails;

    return {
      id: header.id,
      url: header.url,
      title: header.title,
      tagsJson: header.tagsJson,
      details: filtered.map((detail) => {
        const canDecrypt = canDecryptCredential(user);
        const maskedPassword = detail.passwordEnc
          ? canDecrypt
            ? maskPassword(decrypt(detail.passwordEnc))
            : maskPassword("********")
          : "";

        return {
          id: detail.id,
          authorityCode: detail.authorityCode,
          authorityLabel: detail.authorityCode ? (authorityLabelMap.get(detail.authorityCode) ?? null) : null,
          typeCode: detail.typeCode,
          typeLabel: detail.typeCode ? (TYPE_LABELS[detail.typeCode] ?? null) : null,
          loginTypeCode: detail.loginTypeCode,
          loginTypeLabel: detail.loginTypeCode ? (LOGIN_TYPE_LABELS[detail.loginTypeCode] ?? null) : null,
          idSourceType: detail.idSourceType,
          idSourceLabel: detail.idSourceType ? (SOURCE_TYPE_LABELS[detail.idSourceType] ?? null) : null,
          idMasterId: detail.idMasterId,
          loginId: detail.loginId,
          passwordSourceType: detail.passwordSourceType,
          passwordSourceLabel: detail.passwordSourceType ? (SOURCE_TYPE_LABELS[detail.passwordSourceType] ?? null) : null,
          passwordMasterId: detail.passwordMasterId,
          password: maskedPassword,
          employeeId: detail.employeeId,
          isPersonal: detail.employeeId !== null,
          visibility: { canDecryptCredential: canDecrypt, canCopyCredential: canCopyCredential(user) },
        };
      }),
    };
  });

  return createPaginationResponse(items, totalCount, pagination);
}
