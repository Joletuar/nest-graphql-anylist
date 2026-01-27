import { InfrastructureException } from '@modules/shared/domain/exceptions/infrastructure.exception';

export class NotFoundItemModelException extends InfrastructureException {
  constructor(id: string) {
    super({
      originalError: null,
      message: `An item <${id}> not found when try to perfom update operation`,
      details: [
        { cause: `Item with id <${id}> does not exist in the database.` },
      ],
    });

    this.name = this.constructor.name;
  }
}
