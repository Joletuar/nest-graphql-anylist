import {
  InfrastructureErrorObject,
  InfrastructureException,
} from '@modules/shared/domain/exceptions/infrastructure.exception';

export class CacheServiceException extends InfrastructureException {
  constructor(
    originalError: unknown,
    details: InfrastructureErrorObject['details'],
  ) {
    super({
      message: 'CacheService error',
      details,
      originalError,
    });

    this.name = this.constructor.name;
  }
}
