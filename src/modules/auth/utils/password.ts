import { compare, hash } from "bcryptjs";

export const PASSWORD_SALT_ROUNDS = 10;

export async function hashPassword(plainPassword: string): Promise<string> {
  return hash(plainPassword, PASSWORD_SALT_ROUNDS);
}

export async function comparePassword(plainPassword: string, passwordHash: string): Promise<boolean> {
  return compare(plainPassword, passwordHash);
}
