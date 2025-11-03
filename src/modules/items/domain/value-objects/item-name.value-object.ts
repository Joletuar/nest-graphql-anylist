import { ErrorObject } from '@modules/shared/domain/base.error';
import { DomainValidationException } from '@modules/shared/domain/exceptions/domain-validation.exception';
import { StringValueObject } from '@modules/shared/domain/value-objects/string.value-object';

export class ItemName extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsAValidName();
  }

  private ensureIsAValidName(): void {
    this.ensureHasMinMaxLength();
  }

  private ensureHasMinMaxLength(): void {
    const details: ErrorObject['details'] = [];

    if (this._value.length < 3)
      details.push({ cause: 'Item name must be at least 3 characters long.' });
    if (this._value.length > 256)
      details.push({ cause: 'Item name must be at most 256 characters long.' });

    if (details.length > 0) {
      throw new DomainValidationException(details);
    }
  }
}
