import { ErrorObject } from '@modules/shared/domain/base.error';
import { DomainValidationException } from '@modules/shared/domain/exceptions/domain-validation.exception';
import { StringValueObject } from '@modules/shared/domain/value-objects/string.value-object';

export class UserPassword extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureIsValidPassword();
  }

  private ensureIsValidPassword(): void {
    const details: ErrorObject['details'] = [];

    const lengthError = this.ensureMinimumLength();
    if (lengthError) {
      details.push(...lengthError);
    }

    const strengthError = this.ensureIsStrongPassword();
    if (strengthError) {
      details.push(...strengthError);
    }

    if (details.length > 0) {
      throw new DomainValidationException(details);
    }
  }

  private ensureMinimumLength(): ErrorObject['details'] | void {
    if (this._value.length < 8) {
      return [
        {
          cause: 'The password must be at least 8 characters long.',
        },
      ];
    }
  }

  private ensureIsStrongPassword(): ErrorObject['details'] | void {
    const hasUpperCase = /[A-Z]/.test(this._value);
    const hasLowerCase = /[a-z]/.test(this._value);
    const hasNumbers = /[0-9]/.test(this._value);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(this._value);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
      return [
        {
          cause:
            'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        },
      ];
    }
  }
}
