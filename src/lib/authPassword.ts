const SYMBOL_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export type PasswordErrorCode =
  | "PASSWORD_TOO_SHORT"
  | "PASSWORD_MISSING_UPPERCASE"
  | "PASSWORD_MISSING_NUMBER"
  | "PASSWORD_MISSING_SYMBOL";

export function validatePassword(password: string): PasswordErrorCode | null {
  if (password.length < 8) return "PASSWORD_TOO_SHORT";
  if (!/[A-Z]/.test(password)) return "PASSWORD_MISSING_UPPERCASE";
  if (!/[0-9]/.test(password)) return "PASSWORD_MISSING_NUMBER";
  if (!SYMBOL_RE.test(password)) return "PASSWORD_MISSING_SYMBOL";
  return null;
}

export function passwordChecks(password: string) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: SYMBOL_RE.test(password),
  };
}
