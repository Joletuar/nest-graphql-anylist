import { InfrastructureException } from '@modules/shared/domain/exceptions/infrastructure.exception';

export class NotFoundListModelException extends InfrastructureException {
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
