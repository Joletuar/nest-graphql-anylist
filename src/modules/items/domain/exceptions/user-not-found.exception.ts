import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super({
      message: `There is not user associated with the id: ${userId}`,
      details: [
        {
          cause: "The item's userId does not match any user in the database",
        },
      ],
    });

    this.name = this.constructor.name;
  }
}
