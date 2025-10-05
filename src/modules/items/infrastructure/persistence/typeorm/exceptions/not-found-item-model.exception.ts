import { InfraestructureException } from '@shared/domain/exceptions/infraestructure.exception';

export class NotFoundItemModelException extends InfraestructureException {
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
