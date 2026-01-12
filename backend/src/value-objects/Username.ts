/**
 * Value Object for Username validation
 * Encapsulates username validation logic
 */
export class Username {
  private readonly value: string;

  constructor(username: string) {
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      throw new Error('Username is required');
    }

    if (trimmedUsername.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (trimmedUsername.length > 50) {
      throw new Error('Username must be less than 50 characters');
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }

    this.value = trimmedUsername;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Username): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
