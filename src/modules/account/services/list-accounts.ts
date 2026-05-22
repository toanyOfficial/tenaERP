import { decrypt } from "@/lib/crypto/aes";
import { createPaginationResponse, parsePagination } from "@/lib/pagination";
import { canCopyCredential, canDecryptCredential } from "@/modules/account/helpers/visibility";
import { maskPassword } from "@/utils/masking";
import type { LoginSuccessUser } from "@/modules/auth/types";
import { listAccountHeadersQuery } from "@/modules/account/queries/list-accounts";
import type { ListAccountsQuery } from "@/modules/account/validators/list-accounts";

export async function listAccountsService(query: ListAccountsQuery, user: LoginSuccessUser) {
  const pagination = parsePagination({ page: query.page, limit: query.limit });
  const { totalCount, headers, details } = await listAccountHeadersQuery({ query, ...pagination });

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
          authorityCode: detail.authorityCode,
          typeCode: detail.typeCode,
          loginTypeCode: detail.loginTypeCode,
          idSourceType: detail.idSourceType,
          idMasterId: detail.idMasterId,
          loginId: detail.loginId,
          passwordSourceType: detail.passwordSourceType,
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
