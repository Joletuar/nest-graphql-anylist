import { InfraestructureException } from 'src/modules/shared/domain/exceptions/infraestructure.exception';

export class NotFoundUserModelException extends InfraestructureException {
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
