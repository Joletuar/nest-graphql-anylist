import { DomainValidationException } from '@modules/shared/domain/exceptions/domain-validation.exception';
import { StringValueObject } from '@modules/shared/domain/value-objects/string.value-object';

export class UserFullName extends StringValueObject {
  private readonly MIN_LENGTH = 3 as const;
  private readonly MAX_LENGTH = 100 as const;

  constructor(value: string) {
    super(value);
    this.ensureIsValidFullName();
  }

  private ensureIsValidFullName(): void {
    this.validateMinMaxLength();
  }

  private validateMinMaxLength(): void {
    if (
      this.value.length < this.MIN_LENGTH ||
      this.value.length > this.MAX_LENGTH
    ) {
      throw new DomainValidationException([
        {
          cause: `User full name must be between ${this.MIN_LENGTH} and ${this.MAX_LENGTH} characters long.`,
        },
      ]);
    }
  }
}
