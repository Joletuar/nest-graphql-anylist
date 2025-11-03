import { DomainValidationException } from '../exceptions/domain-validation.exception';
import { RootValueObject } from './root.value-object';

export abstract class NumberValueObject extends RootValueObject<number> {
  constructor(value: number) {
    super(value);
    this.ensureIsAValidNumber();
  }

  private ensureIsAValidNumber(): void {
    if (typeof this._value != 'number' || isNaN(this._value)) {
      throw new DomainValidationException([
        {
          cause: `The value is not a valid number, provided value: ${String(this._value)}`,
        },
      ]);
    }
  }
}
