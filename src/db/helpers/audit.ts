import { sql } from "drizzle-orm";

export type AuditInsertInput = {
  actorId?: number | null;
};

export function buildAuditInsert(input: AuditInsertInput) {
  return {
    createdBy: input.actorId ?? null,
    updatedBy: input.actorId ?? null,
  } as const;
}

export type AuditUpdateInput = {
  actorId?: number | null;
};

export function buildAuditUpdate(input: AuditUpdateInput) {
  return {
    updatedBy: input.actorId ?? null,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  } as const;
}
