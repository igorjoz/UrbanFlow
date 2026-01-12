/**
 * Value Object for Stop Name validation
 * Represents a ZTM stop name
 */
export class StopName {
  private readonly value: string;

  constructor(stopName: string) {
    const trimmedName = stopName.trim();

    if (!trimmedName) {
      throw new Error('Stop name is required');
    }

    if (trimmedName.length < 2) {
      throw new Error('Stop name must be at least 2 characters long');
    }

    if (trimmedName.length > 100) {
      throw new Error('Stop name must be less than 100 characters');
    }

    this.value = trimmedName;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: StopName): boolean {
    return this.value.toLowerCase() === other.getValue().toLowerCase();
  }

  toString(): string {
    return this.value;
  }
}
