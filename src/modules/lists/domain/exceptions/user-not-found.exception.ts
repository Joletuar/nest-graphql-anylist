import { DomainException } from 'src/modules/shared/domain/exceptions/domain.exception';

export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super({
      message: `User does not exist`,
      details: [
        {
          cause: 'There is not user associated with the given id',
        },
        {
          cause: `The user ${userId} was not found in the system`,
        },
      ],
    });

    this.name = this.constructor.name;
  }
}
