import {
  InfraestructureErrorObject,
  InfraestructureException,
} from '@modules/shared/domain/exceptions/infraestructure.exception';

export class CacheServiceException extends InfraestructureException {
  constructor(
    originalError: unknown,
    details: InfraestructureErrorObject['details'],
  ) {
    super({
      message: 'CacheService error',
      details,
      originalError,
    });

    this.name = this.constructor.name;
  }
}
