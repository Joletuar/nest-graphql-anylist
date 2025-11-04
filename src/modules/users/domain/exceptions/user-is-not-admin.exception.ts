import { DomainException } from '@modules/shared/domain/exceptions/domain.exception';

export class UserIsNotAdminException extends DomainException {
  constructor(cause: string) {
    super({
      message: 'The user is not an admin',
      details: [
        {
          cause,
        },
      ],
    });
  }
}
