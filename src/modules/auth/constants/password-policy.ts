export const PASSWORD_POLICY = {
  minLength: 6,
  maxLength: 20,
  allowedCharactersRegex: /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/,
  repeatedCharacterLimit: 4,
} as const;

export const PASSWORD_POLICY_MESSAGES = {
  length: `비밀번호는 ${PASSWORD_POLICY.minLength}자 이상 ${PASSWORD_POLICY.maxLength}자 이하여야 합니다.`,
  allowedCharacters: "비밀번호는 영문, 숫자, 특수문자만 사용할 수 있습니다.",
  repeatedCharacter: `${PASSWORD_POLICY.repeatedCharacterLimit}회 이상 동일 문자를 연속으로 사용할 수 없습니다.`,
} as const;

export const PASSWORD_POLICY_GUIDE = [
  PASSWORD_POLICY_MESSAGES.length,
  PASSWORD_POLICY_MESSAGES.allowedCharacters,
  PASSWORD_POLICY_MESSAGES.repeatedCharacter,
] as const;
