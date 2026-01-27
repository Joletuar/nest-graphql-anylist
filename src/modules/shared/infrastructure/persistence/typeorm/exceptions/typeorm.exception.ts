import { InfrastructureException } from '@modules/shared/domain/exceptions/infrastructure.exception';

export class TypeOrmException extends InfrastructureException {
  constructor(originalError: unknown) {
    // TODO: here we need to map typeorm errors to graceful errors to client

    const cause =
      'An error has ocurren when try to perfom typeorm requests. Check logs and try later.';

    super({
      message: 'Error in persistence with TypeORM',
      details: [{ cause }],
      originalError,
    });

    this.name = this.constructor.name;
  }
}
