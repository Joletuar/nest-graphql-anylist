import { DomainValidationException } from '@modules/shared/domain/exceptions/domain-validation.exception';
import { StringValueObject } from '@modules/shared/domain/value-objects/string.value-object';

export class UserEmail extends StringValueObject {
  private readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(value: string) {
    super(value);
    this.ensureIsValidEmail();
  }

  private ensureIsValidEmail(): void {
    this.validateEmailFormat();
  }

  private validateEmailFormat(): void {
    if (!this.EMAIL_REGEX.test(this._value)) {
      throw new DomainValidationException([
        {
          cause: 'The email format is invalid.',
        },
      ]);
    }
  }
}
