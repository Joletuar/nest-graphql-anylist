import { InfraestructureException } from 'src/modules/shared/domain/exceptions/infraestructure.exception';

export class TypeOrmCriteriaConverterException extends InfraestructureException {
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
