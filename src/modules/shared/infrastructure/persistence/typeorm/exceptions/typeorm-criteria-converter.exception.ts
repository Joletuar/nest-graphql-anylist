import { InfrastructureException } from '@modules/shared/domain/exceptions/infrastructure.exception';

export class TypeOrmCriteriaConverterException extends InfrastructureException {
  constructor() {
    const cause =
      'An error ocurred when try to convert the criteria to where TypeORM options';

    super({
      message: 'Error TypeORM criteria converter',
      details: [{ cause }],
      originalError: null,
    });

    this.name = this.constructor.name;
  }
}
