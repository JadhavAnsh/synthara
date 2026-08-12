import mailchecker from "mailchecker";
import validator from "validator";

export type EmailValidationResult =
  | { valid: true; normalized: string }
  | { valid: false; error: string };

export function validateEmailAddress(email: string): EmailValidationResult {
  const normalized = email.trim().toLowerCase();

  if (!normalized) {
    return { valid: false, error: "Email is required" };
  }

  if (
    !validator.isEmail(normalized, {
      allow_display_name: false,
      require_tld: true,
      allow_utf8_local_part: false,
      domain_specific_validation: true,
    })
  ) {
    return { valid: false, error: "Enter a valid email address" };
  }

  if (!mailchecker.isValid(normalized)) {
    return {
      valid: false,
      error: "Disposable or blocked email addresses are not allowed",
    };
  }

  return { valid: true, normalized };
}

export function assertValidEmail(email: string) {
  const result = validateEmailAddress(email);

  if (!result.valid) {
    throw new Error(result.error);
  }

  return result.normalized;
}
