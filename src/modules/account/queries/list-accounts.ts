import { and, desc, eq, inArray, like, sql } from "drizzle-orm";
import { db, dbSchema } from "@/db";
import type { ListAccountsQuery } from "@/modules/account/validators/list-accounts";

function buildWhere(query: ListAccountsQuery) {
  const conditions = [eq(dbSchema.accountHeader.deleteYn, "N")];

  if (query.tag) {
    conditions.push(like(sql`json_extract(${dbSchema.accountHeader.tagsJson}, '$')`, `%${query.tag}%`));
  }

  return and(...conditions);
}

export async function listAccountHeadersQuery(params: { query: ListAccountsQuery; limit: number; offset: number }) {
  const where = buildWhere(params.query);

  const [countRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(dbSchema.accountHeader)
    .where(where);

  const headers = await db
    .select({
      id: dbSchema.accountHeader.id,
      url: dbSchema.accountHeader.url,
      title: dbSchema.accountHeader.title,
      tagsJson: dbSchema.accountHeader.tagsJson,
      updatedAt: dbSchema.accountHeader.updatedAt,
    })
    .from(dbSchema.accountHeader)
    .where(where)
    .orderBy(desc(dbSchema.accountHeader.updatedAt), desc(dbSchema.accountHeader.id))
    .limit(params.limit)
    .offset(params.offset);

  if (headers.length === 0) return { totalCount: Number(countRow?.count ?? 0), headers: [], details: [] };

  const headerIds = headers.map((h) => h.id);
  const details = await db
    .select({
      id: dbSchema.accountDetail.id,
      headerId: dbSchema.accountDetail.headerId,
      typeCode: dbSchema.accountDetail.typeCode,
      loginTypeCode: dbSchema.accountDetail.loginTypeCode,
      idSourceType: dbSchema.accountDetail.idSourceType,
      idMasterId: dbSchema.accountDetail.idMasterId,
      loginId: dbSchema.accountDetail.loginId,
      passwordSourceType: dbSchema.accountDetail.passwordSourceType,
      passwordMasterId: dbSchema.accountDetail.passwordMasterId,
      passwordEnc: dbSchema.accountDetail.passwordEnc,
      authorityCode: dbSchema.accountDetail.authorityCode,
      employeeId: dbSchema.accountDetail.employeeId,
    })
    .from(dbSchema.accountDetail)
    .where(inArray(dbSchema.accountDetail.headerId, headerIds));

  return { totalCount: Number(countRow?.count ?? 0), headers, details };
}
