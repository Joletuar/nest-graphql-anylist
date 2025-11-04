import { DomainValidationException } from '../exceptions/domain-validation.exception';
import { RootValueObject } from './root.value-object';

export abstract class BooleanValueObject extends RootValueObject<boolean> {
  constructor(value: boolean) {
    super(value);
    this.ensureIsValidBoolean();
  }

  private ensureIsValidBoolean(): void {
    if (typeof this._value !== 'boolean') {
      throw new DomainValidationException([
        {
          cause: `The value must be a boolean. Provided type: ${String(typeof this._value)}`,
        },
      ]);
    }
  }
}
