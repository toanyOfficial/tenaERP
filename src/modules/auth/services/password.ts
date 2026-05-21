import { assertValidPasswordOrThrow } from "@/modules/auth/utils/password-validation";

export function validatePasswordForCreate(password: string) {
  return assertValidPasswordOrThrow(password);
}

export function validatePasswordForReset(password: string) {
  return assertValidPasswordOrThrow(password);
}

export function validatePasswordForChange(password: string) {
  return assertValidPasswordOrThrow(password);
}
