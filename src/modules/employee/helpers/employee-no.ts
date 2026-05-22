import { and, eq, like, sql } from "drizzle-orm";
import { db, dbSchema } from "@/db";

function toInitials(englishName: string, fallbackName: string) {
  const normalized = englishName.trim().replace(/\s+/g, " ");
  if (!normalized) {
    const fallback = fallbackName.trim();
    return fallback ? fallback[0].toUpperCase() : "X";
  }

  return normalized
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function generateEmployeeNo(input: {
  name: string;
  englishName: string;
  joinDate: string;
  residentRegistrationNoFront: string;
}) {
  const ymd = input.joinDate.replaceAll("-", "");
  const mmdd = input.residentRegistrationNoFront.slice(2, 6);
  const initials = toInitials(input.englishName, input.name);
  const base = `${ymd}${initials}${mmdd}`;

  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(dbSchema.employee)
    .where(and(eq(dbSchema.employee.deleteYn, "N"), like(dbSchema.employee.employeeNo, `${base}%`)));

  const count = Number(row?.count ?? 0);
  if (count === 0) return base;

  return `${base}${String(count + 1).padStart(2, "0")}`;
}
