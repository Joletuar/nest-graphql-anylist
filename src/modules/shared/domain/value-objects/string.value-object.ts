import { DomainValidationException } from '../exceptions/domain-validation.exception';
import { RootValueObject } from './root.value-object';

export abstract class StringValueObject extends RootValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureIsValidString();
  }

  private ensureIsValidString(): void {
    if (
      this._value === undefined ||
      this._value === null ||
      typeof this._value !== 'string'
    ) {
      throw new DomainValidationException([
        {
          cause: `The value must be a string, but received: ${String(this._value)}`,
        },
        {
          cause: 'The value cannot be undefined or null.',
        },
      ]);
    }
  }
}
