import { createHmac, timingSafeEqual } from "node:crypto";
import { AUTH_SESSION_DURATION_SECONDS } from "@/modules/auth/constants";
import type { SessionPayload } from "@/modules/auth/types";
import { getRequiredEnv } from "@/lib/env";

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payloadBase64: string) {
  const secret = getRequiredEnv("SESSION_SECRET");
  return createHmac("sha256", secret).update(payloadBase64).digest("base64url");
}

export function createSessionToken(employeeId: number, employeeNo: string) {
  const exp = Math.floor(Date.now() / 1000) + AUTH_SESSION_DURATION_SECONDS;
  const payload: SessionPayload = { employeeId, employeeNo, exp };
  const payloadBase64 = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(payloadBase64);

  return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [payloadBase64, providedSignature] = token.split(".");

  if (!payloadBase64 || !providedSignature) {
    return null;
  }

  const expectedSignature = sign(payloadBase64);
  const a = Buffer.from(providedSignature);
  const b = Buffer.from(expectedSignature);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }

  const payload = JSON.parse(base64UrlDecode(payloadBase64)) as SessionPayload;

  if (payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
