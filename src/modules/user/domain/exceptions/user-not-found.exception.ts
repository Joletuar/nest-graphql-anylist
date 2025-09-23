import { DomainException } from 'src/modules/shared/domain/exceptions/domain.exception';

export class UserNotFoundException extends DomainException {
  constructor(id: string) {
    super({
      message: `User <${id}> not found.`,
      details: [
        {
          cause: `No user exists with the provided id: ${id}.`,
        },
      ],
    });

    this.name = this.constructor.name;
  }
}
