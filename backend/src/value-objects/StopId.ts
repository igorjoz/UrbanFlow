/**
 * Value Object for Stop ID validation
 * Represents a ZTM stop identifier
 */
export class StopId {
  private readonly value: number;

  constructor(stopId: number | string) {
    const numericValue = typeof stopId === 'string' ? parseInt(stopId, 10) : stopId;

    if (isNaN(numericValue)) {
      throw new Error('Stop ID must be a valid number');
    }

    if (!Number.isInteger(numericValue)) {
      throw new Error('Stop ID must be an integer');
    }

    if (numericValue <= 0) {
      throw new Error('Stop ID must be a positive number');
    }

    if (numericValue > 99999) {
      throw new Error('Stop ID must be less than 100000');
    }

    this.value = numericValue;
  }

  getValue(): number {
    return this.value;
  }

  equals(other: StopId): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value.toString();
  }
}
