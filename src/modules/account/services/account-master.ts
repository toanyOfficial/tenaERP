import { eq } from "drizzle-orm";
import { ForbiddenApiError, NotFoundApiError } from "@/lib/api";
import { encrypt } from "@/lib/crypto/aes";
import { db, dbSchema } from "@/db";

export async function listAccountMasterService() {
  const [ids, passwords] = await Promise.all([
    db.select().from(dbSchema.idMaster).orderBy(dbSchema.idMaster.id),
    db.select({ id: dbSchema.passwordMaster.id, title: dbSchema.passwordMaster.title, authorityCode: dbSchema.passwordMaster.authorityCode, useYn: dbSchema.passwordMaster.useYn, immutableYn: dbSchema.passwordMaster.immutableYn, createdAt: dbSchema.passwordMaster.createdAt }).from(dbSchema.passwordMaster).orderBy(dbSchema.passwordMaster.id),
  ]);
  return { idMasters: ids, passwordMasters: passwords };
}

export async function createIdMasterService(input: { title: string; loginId: string; useYn?: "Y"|"N" }, actorId: number) {
  const [created] = await db.insert(dbSchema.idMaster).values({ title: input.title, loginId: input.loginId, useYn: input.useYn ?? "Y", createdBy: actorId, updatedBy: actorId }).$returningId();
  return { id: created?.id };
}

export async function updateIdMasterService(input: { id: number; title?: string; loginId?: string; useYn?: "Y"|"N" }, actorId: number) {
  const [found] = await db.select({ id: dbSchema.idMaster.id }).from(dbSchema.idMaster).where(eq(dbSchema.idMaster.id, input.id)).limit(1);
  if (!found) throw new NotFoundApiError("아이디마스터를 찾을 수 없습니다.");
  await db.update(dbSchema.idMaster).set({ title: input.title, loginId: input.loginId, useYn: input.useYn, updatedBy: actorId }).where(eq(dbSchema.idMaster.id, input.id));
  return { id: input.id };
}

export async function createPasswordMasterService(input: { title: string; password: string; authorityCode?: string; useYn?: "Y"|"N"; immutableYn?: "Y"|"N" }, actorId: number) {
  const [created] = await db.insert(dbSchema.passwordMaster).values({ title: input.title, passwordEnc: encrypt(input.password), authorityCode: input.authorityCode || null, useYn: input.useYn ?? "Y", immutableYn: input.immutableYn ?? "Y", createdBy: actorId, updatedBy: actorId }).$returningId();
  return { id: created?.id };
}

export async function updatePasswordMasterService(input: { id: number; title?: string; password?: string; authorityCode?: string; useYn?: "Y"|"N" }, actorId: number) {
  const [found] = await db.select({ id: dbSchema.passwordMaster.id, immutableYn: dbSchema.passwordMaster.immutableYn, useYn: dbSchema.passwordMaster.useYn }).from(dbSchema.passwordMaster).where(eq(dbSchema.passwordMaster.id, input.id)).limit(1);
  if (!found) throw new NotFoundApiError("비밀번호마스터를 찾을 수 없습니다.");
  if (found.immutableYn === "Y" && found.useYn === "Y") throw new ForbiddenApiError("사용중 immutable 마스터는 수정할 수 없습니다.");
  const payload: Record<string, unknown> = { title: input.title, authorityCode: input.authorityCode || null, useYn: input.useYn, updatedBy: actorId };
  if (input.password && input.password.trim()) payload.passwordEnc = encrypt(input.password);
  await db.update(dbSchema.passwordMaster).set(payload).where(eq(dbSchema.passwordMaster.id, input.id));
  return { id: input.id };
}
