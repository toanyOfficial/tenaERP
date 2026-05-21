import { PASSWORD_POLICY_GUIDE } from "@/modules/auth/constants/password-policy";
import { validatePasswordPolicy } from "@/modules/auth/validators/password";

export function getPasswordPolicyGuide() {
  return [...PASSWORD_POLICY_GUIDE];
}

export function getPasswordPolicyStatus(password: string) {
  const result = validatePasswordPolicy(password);

  return result.items.map((item) => ({
    message: item.message,
    status: item.valid ? "success" : "fail",
  }));
}
