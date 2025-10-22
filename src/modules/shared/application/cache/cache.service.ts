import { Nullable } from '@modules/shared/domain/nullable.type';

export abstract class CacheService {
  abstract setValue<T>(key: string, value: T, options?: Options): Promise<void>;

  abstract getValue<T>(key: string): Promise<Nullable<T>>;
}

export interface Options {
  ttl?: number | string; // miliseconds
}
