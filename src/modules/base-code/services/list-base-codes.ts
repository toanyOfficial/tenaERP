import { and, eq, inArray } from "drizzle-orm";
import { db, dbSchema } from "@/db";

export async function listBaseCodesByGroups(groups: string[]) {
  const normalizedGroups = groups.map((group) => group.trim()).filter(Boolean);
  if (normalizedGroups.length === 0) return {} as Record<string, Array<{ key: string; value: string }>>;

  const rows = await db
    .select({ group: dbSchema.baseCode.group, key: dbSchema.baseCode.key, value: dbSchema.baseCode.value })
    .from(dbSchema.baseCode)
    .where(and(inArray(dbSchema.baseCode.group, normalizedGroups), eq(dbSchema.baseCode.useYn, "Y")));

  return normalizedGroups.reduce<Record<string, Array<{ key: string; value: string }>>>((acc, group) => {
    acc[group] = rows.filter((row) => row.group === group).map((row) => ({ key: row.key, value: row.value }));
    return acc;
  }, {});
}
