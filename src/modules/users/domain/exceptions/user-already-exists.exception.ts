import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super({
      message: `User with email ${email} already exists`,
      details: [
        {
          cause: 'User already exists with the same email',
        },
      ],
    });

    this.name = this.constructor.name;
  }
}
