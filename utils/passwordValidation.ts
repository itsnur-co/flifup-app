/**
 * Password Validation Utilities
 * Functions for validating password strength and requirements
 */

export interface PasswordRequirements {
  hasMinLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
}

/**
 * Checks if password meets minimum length requirement
 */
export const hasMinimumLength = (password: string, minLength: number = 8): boolean => {
  return password.length >= minLength;
};

/**
 * Checks if password contains at least one number
 */
export const hasNumber = (password: string): boolean => {
  return /\d/.test(password);
};

/**
 * Checks if password contains at least one symbol
 */
export const hasSymbol = (password: string): boolean => {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
};

/**
 * Checks if password contains at least one uppercase letter
 */
export const hasUppercase = (password: string): boolean => {
  return /[A-Z]/.test(password);
};

/**
 * Checks if password contains at least one lowercase letter
 */
export const hasLowercase = (password: string): boolean => {
  return /[a-z]/.test(password);
};

/**
 * Gets all password requirements status
 * Based on API requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export const getPasswordRequirements = (password: string): PasswordRequirements => {
  return {
    hasMinLength: hasMinimumLength(password),
    hasNumber: hasNumber(password),
    hasUppercase: hasUppercase(password),
    hasLowercase: hasLowercase(password),
  };
};

/**
 * Calculates password strength as a percentage (0-100)
 */
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;

  let strength = 0;
  const maxStrength = 100;

  // Length contribution (40%)
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;

  // Character variety contribution (60%)
  if (hasLowercase(password)) strength += 15;
  if (hasUppercase(password)) strength += 15;
  if (hasNumber(password)) strength += 15;
  if (hasSymbol(password)) strength += 15;

  return Math.min(strength, maxStrength);
};

/**
 * Checks if password meets all basic requirements
 * Based on API requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export const isPasswordValid = (password: string): boolean => {
  const requirements = getPasswordRequirements(password);
  return (
    requirements.hasMinLength &&
    requirements.hasNumber &&
    requirements.hasUppercase &&
    requirements.hasLowercase
  );
};

/**
 * Gets a human-readable password strength label
 */
export const getPasswordStrengthLabel = (strength: number): string => {
  if (strength < 40) return 'Weak';
  if (strength < 70) return 'Medium';
  return 'Strong';
};
