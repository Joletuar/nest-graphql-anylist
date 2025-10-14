import { CACHE_MANAGER, Cache as CacheManager } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import {
  CacheService,
  Options,
} from '@modules/shared/application/cache/cache-service.interface';
import { Nullable } from '@modules/shared/domain/nullable.type';

import { RedisCacheServiceException } from './exceptions/redis-cache-service.exception';

@Injectable()
export class RedisCacheService extends CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheManager) {
    super();
  }

  async setValue<T>(
    key: string,
    value: T,
    options: Options = {},
  ): Promise<void> {
    try {
      const { ttl = 5000 } = options;

      await this.cacheManager.set(key, value, Number(ttl));
    } catch (error: unknown) {
      this.handlerError(error);
    }
  }

  async getValue<T>(key: string): Promise<Nullable<T>> {
    try {
      const value = await this.cacheManager.get<T>(key);

      if (!value) return null;

      return value;
    } catch (error) {
      this.handlerError(error);
    }
  }

  private handlerError(error: unknown): never {
    throw new RedisCacheServiceException(error);
  }
}
