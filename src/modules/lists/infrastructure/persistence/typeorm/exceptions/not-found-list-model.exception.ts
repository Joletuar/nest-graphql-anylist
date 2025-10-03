import { InfraestructureException } from 'src/modules/shared/domain/exceptions/infraestructure.exception';

export class NotFoundListModelException extends InfraestructureException {
  constructor(id: string) {
    super({
      originalError: null,
      message: `A list <${id}> not found when try to perform update operation`,
      details: [
        { cause: `List with id <${id}> does not exist in the database.` },
      ],
    });

    this.name = this.constructor.name;
  }
}
