import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import { and, eq } from "drizzle-orm";
import { ForbiddenApiError, NotFoundApiError, ValidationApiError } from "@/lib/api";
import { db, dbSchema } from "@/db";
import { isExecutive } from "@/modules/auth/helpers/authority";

const CONTRACT_DIR_RELATIVE = path.join("uploads", "contracts");
const CONTRACT_DIR_ABSOLUTE = path.join(process.cwd(), CONTRACT_DIR_RELATIVE);
const ALLOWED_MIME = "application/pdf";
const MAX_FILE_SIZE = 1024 * 1024;

async function ensureContractDirectory() {
  await mkdir(CONTRACT_DIR_ABSOLUTE, { recursive: true });
}

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
}

async function existsFile(filePath: string) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function buildUniqueFileName(employeeNo: string, contractId: number) {
  const safeEmployeeNo = sanitizeSegment(employeeNo);
  const base = `${safeEmployeeNo}_${contractId}`;

  for (let suffix = 0; suffix < 1000; suffix += 1) {
    const candidate = suffix === 0 ? `${base}.pdf` : `${base}_${suffix}.pdf`;
    const absolute = path.join(CONTRACT_DIR_ABSOLUTE, candidate);
    if (!(await existsFile(absolute))) return candidate;
  }

  throw new ValidationApiError("파일명을 생성할 수 없습니다.", [
    { field: "file", message: "동일 파일명이 너무 많습니다. 잠시 후 다시 시도해주세요." },
  ]);
}

export async function uploadEmployeeContractFile(params: {
  contractId: number;
  file: File;
  actorId: number;
  actorAuthorityCode: string | null;
}) {
  if (!isExecutive(params.actorAuthorityCode)) {
    throw new ForbiddenApiError("계약서 업로드 권한이 없습니다.");
  }

  if (params.file.type !== ALLOWED_MIME) {
    throw new ValidationApiError("PDF 파일만 업로드할 수 있습니다.", [{ field: "file", message: "파일 형식이 올바르지 않습니다." }]);
  }

  if (params.file.size > MAX_FILE_SIZE) {
    throw new ValidationApiError("파일 크기는 1MB 이하여야 합니다.", [{ field: "file", message: "최대 1MB까지 업로드 가능합니다." }]);
  }

  const [contract] = await db
    .select({
      id: dbSchema.employeeContract.id,
      employeeId: dbSchema.employeeContract.employeeId,
      filePath: dbSchema.employeeContract.filePath,
      deleteYn: dbSchema.employeeContract.deleteYn,
      employeeNo: dbSchema.employee.employeeNo,
      employeeDeleteYn: dbSchema.employee.deleteYn,
    })
    .from(dbSchema.employeeContract)
    .innerJoin(dbSchema.employee, eq(dbSchema.employee.id, dbSchema.employeeContract.employeeId))
    .where(and(eq(dbSchema.employeeContract.id, params.contractId), eq(dbSchema.employeeContract.deleteYn, "N")))
    .limit(1);

  if (!contract || contract.deleteYn === "Y" || contract.employeeDeleteYn === "Y") {
    throw new NotFoundApiError("계약 정보를 찾을 수 없습니다.");
  }

  await ensureContractDirectory();

  const uniqueFileName = await buildUniqueFileName(contract.employeeNo, contract.id);
  const absolutePath = path.join(CONTRACT_DIR_ABSOLUTE, uniqueFileName);
  const relativePath = `${CONTRACT_DIR_RELATIVE}/${uniqueFileName}`.replaceAll("\\", "/");

  const bytes = await params.file.arrayBuffer();
  await writeFile(absolutePath, Buffer.from(bytes));

  if (contract.filePath) {
    const oldAbsolute = path.join(process.cwd(), contract.filePath);
    if (await existsFile(oldAbsolute)) {
      await unlink(oldAbsolute);
    }
  }

  await db
    .update(dbSchema.employeeContract)
    .set({
      filePath: relativePath,
      updatedBy: params.actorId,
    })
    .where(and(eq(dbSchema.employeeContract.id, params.contractId), eq(dbSchema.employeeContract.deleteYn, "N")));

  return { contractId: params.contractId, filePath: relativePath };
}

export async function deleteEmployeeContractFile(params: {
  contractId: number;
  actorId: number;
  actorAuthorityCode: string | null;
}) {
  if (!isExecutive(params.actorAuthorityCode)) {
    throw new ForbiddenApiError("계약서 삭제 권한이 없습니다.");
  }

  const [contract] = await db
    .select({
      id: dbSchema.employeeContract.id,
      filePath: dbSchema.employeeContract.filePath,
      deleteYn: dbSchema.employeeContract.deleteYn,
    })
    .from(dbSchema.employeeContract)
    .where(and(eq(dbSchema.employeeContract.id, params.contractId), eq(dbSchema.employeeContract.deleteYn, "N")))
    .limit(1);

  if (!contract || contract.deleteYn === "Y") {
    throw new NotFoundApiError("계약 정보를 찾을 수 없습니다.");
  }

  if (!contract.filePath) {
    return { contractId: params.contractId, deleted: false };
  }

  const absolute = path.join(process.cwd(), contract.filePath);
  if (await existsFile(absolute)) {
    await unlink(absolute);
  }

  await db
    .update(dbSchema.employeeContract)
    .set({
      filePath: null,
      updatedBy: params.actorId,
    })
    .where(and(eq(dbSchema.employeeContract.id, params.contractId), eq(dbSchema.employeeContract.deleteYn, "N")));

  return { contractId: params.contractId, deleted: true };
}
