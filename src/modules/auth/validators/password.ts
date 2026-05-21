import { PASSWORD_POLICY, PASSWORD_POLICY_MESSAGES } from "@/modules/auth/constants/password-policy";

export type PasswordValidationRule = "length" | "allowedCharacters" | "repeatedCharacter";

export type PasswordValidationItem = {
  rule: PasswordValidationRule;
  valid: boolean;
  message: string;
};

export type PasswordValidationResult = {
  valid: boolean;
  items: PasswordValidationItem[];
  messages: string[];
};

function hasRepeatedCharacter(value: string, repeatLimit: number) {
  let count = 1;

  for (let index = 1; index < value.length; index += 1) {
    if (value[index] === value[index - 1]) {
      count += 1;
      if (count >= repeatLimit) {
        return true;
      }
    } else {
      count = 1;
    }
  }

  return false;
}

export function validatePasswordPolicy(password: string): PasswordValidationResult {
  const items: PasswordValidationItem[] = [
    {
      rule: "length",
      valid: password.length >= PASSWORD_POLICY.minLength && password.length <= PASSWORD_POLICY.maxLength,
      message: PASSWORD_POLICY_MESSAGES.length,
    },
    {
      rule: "allowedCharacters",
      valid: PASSWORD_POLICY.allowedCharactersRegex.test(password),
      message: PASSWORD_POLICY_MESSAGES.allowedCharacters,
    },
    {
      rule: "repeatedCharacter",
      valid: !hasRepeatedCharacter(password, PASSWORD_POLICY.repeatedCharacterLimit),
      message: PASSWORD_POLICY_MESSAGES.repeatedCharacter,
    },
  ];

  const messages = items.filter((item) => !item.valid).map((item) => item.message);

  return {
    valid: messages.length === 0,
    items,
    messages,
  };
}
