import { and, eq, type SQL } from "drizzle-orm";

export function andWhere(...conditions: Array<SQL | undefined>) {
  const filtered = conditions.filter((condition): condition is SQL => condition !== undefined);

  if (filtered.length === 0) {
    return undefined;
  }

  return and(...filtered);
}

export function eqIfDefined<T>(column: T, value: unknown) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return eq(column as never, value as never);
}
