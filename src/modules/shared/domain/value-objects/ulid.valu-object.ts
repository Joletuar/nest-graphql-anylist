import { isValid, ulid } from 'ulidx';

import { DomainValidationException } from '../exceptions/domain-validation.exception';
import { StringValueObject } from './string.value-object';

export abstract class UlidValueObject extends StringValueObject {
  static generateUlid(): string {
    return ulid();
  }

  constructor(value: string) {
    super(value);
    this.ensureIsValidUlid();
  }

  private ensureIsValidUlid(): void {
    if (!isValid(this._value)) {
      throw new DomainValidationException([
        {
          cause: 'The ULID is not valid',
        },
      ]);
    }
  }
}
