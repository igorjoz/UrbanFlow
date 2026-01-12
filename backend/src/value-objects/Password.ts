/**
 * Value Object for Password validation
 * Encapsulates password validation logic (plain text password before hashing)
 */
export class Password {
  private readonly value: string;

  constructor(password: string) {
    if (!password) {
      throw new Error('Password is required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (password.length > 100) {
      throw new Error('Password must be less than 100 characters');
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one digit');
    }

    this.value = password;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return '********'; // Never expose password in logs
  }
}
