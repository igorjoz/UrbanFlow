/**
 * Value Object for Hashed Password
 * Represents a password that has already been hashed
 */
export class HashedPassword {
  private readonly value: string;

  constructor(hashedPassword: string) {
    if (!hashedPassword) {
      throw new Error('Hashed password is required');
    }

    // bcrypt hashes are typically 60 characters
    if (hashedPassword.length < 50) {
      throw new Error('Invalid hashed password format');
    }

    this.value = hashedPassword;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return '[HASHED]';
  }
}
