import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class InvalidCredentialsException extends DomainException {
  constructor(email: string) {
    super({
      message: `The user <${email}> has invalid credentials.`,
      details: [
        {
          cause: 'The email or password are not valid.',
        },
      ],
    });

    this.name = this.constructor.name;
  }
}
