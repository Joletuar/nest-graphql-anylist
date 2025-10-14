import { CacheServiceException } from '@modules/shared/application/cache/cache-service.exception';

export class RedisCacheServiceException extends CacheServiceException {
  constructor(originalError: unknown) {
    super(originalError, [
      {
        cause: 'An error occurred while interacting with the Redis cache',
      },
    ]);

    this.name = this.constructor.name;
  }
}
