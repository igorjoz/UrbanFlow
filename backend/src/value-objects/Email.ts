/**
 * Value Object for Email validation
 * Encapsulates email validation logic
 */
export class Email {
  private readonly value: string;

  constructor(email: string) {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Invalid email format');
    }

    if (trimmedEmail.length > 255) {
      throw new Error('Email must be less than 255 characters');
    }

    this.value = trimmedEmail;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
