import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, dbSchema } from "@/db";
import { ForbiddenApiError } from "@/lib/api";
import { AUTH_SESSION_COOKIE_NAME } from "@/modules/auth/constants";
import type { AuthorityCode } from "@/modules/auth/constants/authority";
import { canAccessManagementScreen, hasAuthority } from "@/modules/auth/helpers/authority";
import { AuthError } from "@/modules/auth/helpers/errors";
import type { LoginSuccessUser } from "@/modules/auth/types";
import { verifySessionToken } from "@/modules/auth/utils/session";

export async function parseSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const parsed = verifySessionToken(token);
  return parsed;
}

export async function getCurrentUser(): Promise<LoginSuccessUser | null> {
  const session = await parseSession();

  if (!session) {
    return null;
  }

  const [employee] = await db
    .select({
      id: dbSchema.employee.id,
      employeeNo: dbSchema.employee.employeeNo,
      name: dbSchema.employee.name,
      authorityCode: dbSchema.employee.authorityCode,
      deleteYn: dbSchema.employee.deleteYn,
    })
    .from(dbSchema.employee)
    .where(eq(dbSchema.employee.id, session.employeeId))
    .limit(1);

  if (!employee || employee.deleteYn === "Y") {
    return null;
  }

  return {
    id: employee.id,
    employeeNo: employee.employeeNo,
    name: employee.name,
    authorityCode: employee.authorityCode,
  };
}

export async function requireAuth(): Promise<LoginSuccessUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthError();
  }

  return user;
}

export async function requireAuthority(minimumAuthorityCode: AuthorityCode): Promise<LoginSuccessUser> {
  const user = await requireAuth();

  if (!hasAuthority(user.authorityCode, minimumAuthorityCode)) {
    throw new ForbiddenApiError("권한이 없습니다.");
  }

  return user;
}

export async function requireManagementAuth(): Promise<LoginSuccessUser> {
  const user = await requireAuth();

  if (!canAccessManagementScreen(user.authorityCode)) {
    throw new ForbiddenApiError("관리 화면 접근 권한이 없습니다.");
  }

  return user;
}

export async function requireAuthPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
