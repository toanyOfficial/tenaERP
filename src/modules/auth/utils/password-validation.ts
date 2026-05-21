import { validatePasswordPolicy } from "@/modules/auth/validators/password";

export function assertValidPasswordOrThrow(password: string) {
  const result = validatePasswordPolicy(password);

  if (!result.valid) {
    throw new Error(result.messages[0] ?? "유효하지 않은 비밀번호입니다.");
  }

  return result;
}
