import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getRequiredEnv } from "@/lib/env";

const AES_ALGORITHM = "aes-256-cbc";
const IV_BYTE_LENGTH = 16;

function getAesKey() {
  const rawSecret = getRequiredEnv("AES_SECRET_KEY");
  return createHash("sha256").update(rawSecret, "utf8").digest();
}

export function encrypt(plainText: string): string {
  const iv = randomBytes(IV_BYTE_LENGTH);
  const cipher = createCipheriv(AES_ALGORITHM, getAesKey(), iv);

  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);

  return `${iv.toString("base64url")}:${encrypted.toString("base64url")}`;
}

export function decrypt(encryptedText: string): string {
  const [ivBase64, cipherBase64] = encryptedText.split(":");

  if (!ivBase64 || !cipherBase64) {
    throw new Error("Invalid encrypted text format.");
  }

  const iv = Buffer.from(ivBase64, "base64url");
  const encryptedBuffer = Buffer.from(cipherBase64, "base64url");

  if (iv.length !== IV_BYTE_LENGTH) {
    throw new Error("Invalid IV length.");
  }

  const decipher = createDecipheriv(AES_ALGORITHM, getAesKey(), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

  return decrypted.toString("utf8");
}
