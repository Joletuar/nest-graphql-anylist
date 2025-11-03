import { DomainValidationException } from '@modules/shared/domain/exceptions/domain-validation.exception';
import { NumberValueObject } from '@modules/shared/domain/value-objects/number.value-object';

export class ItemStock extends NumberValueObject {
  private MIN_VALUE = 0 as const;
  private MAX_VALUE = 1000 as const;

  constructor(value: number) {
    super(value);
  }

  private ensureIsAValidStock(): void {
    this.ensureIsAValidStock();
  }

  private validateMinMaxValue(): void {
    if (this._value > this.MAX_VALUE || this._value < this.MIN_VALUE) {
      throw new DomainValidationException([
        {
          cause: `Item stock must be between ${this.MIN_VALUE} and ${this.MAX_VALUE}.`,
        },
      ]);
    }
  }
}
