import { and, eq, like, sql } from "drizzle-orm";
import { db, dbSchema } from "@/db";

function toInitial(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "X";
  return trimmed[0].toUpperCase();
}

function formatDatePart(date: Date) {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return { ymd: `${yyyy}${mm}${dd}`, mmdd: `${mm}${dd}` };
}

export async function generateEmployeeNo(name: string, now = new Date()) {
  const { ymd, mmdd } = formatDatePart(now);
  const initial = toInitial(name);
  const base = `${ymd}${initial}${mmdd}`;

  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(dbSchema.employee)
    .where(and(eq(dbSchema.employee.deleteYn, "N"), like(dbSchema.employee.employeeNo, `${base}%`)));

  const count = Number(row?.count ?? 0);
  if (count === 0) return base;

  return `${base}${String(count + 1).padStart(2, "0")}`;
}
