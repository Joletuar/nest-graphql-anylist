import { InfrastructureException } from '@modules/shared/domain/exceptions/infrastructure.exception';

export class NotFoundUserModelException extends InfrastructureException {
  constructor(id: string) {
    super({
      originalError: null,
      message: `An user <${id}> not found when try to perfom update operation`,
      details: [
        { cause: `User with id <${id}> does not exist in the database.` },
      ],
    });

    this.name = this.constructor.name;
  }
}
