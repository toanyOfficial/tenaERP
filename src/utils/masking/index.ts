export function maskResidentRegistration(backPart: string | null | undefined): string {
  if (!backPart) {
    return "";
  }

  const visible = backPart.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(backPart.length - 1, 0))}`;
}

export function maskPassword(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  return "*".repeat(Math.max(value.length, 8));
}

export function maskBankAccount(accountNo: string | null | undefined): string {
  if (!accountNo) {
    return "";
  }

  const cleaned = accountNo.replace(/\s+/g, "");
  if (cleaned.length <= 4) {
    return "*".repeat(cleaned.length);
  }

  const tail = cleaned.slice(-4);
  return `${"*".repeat(cleaned.length - 4)}${tail}`;
}
