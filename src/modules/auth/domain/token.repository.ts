/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class TokenRepository {
  abstract generate(payload: Record<string, any>): Promise<string>;

  abstract validate<T>(token: string): Promise<T>;
}
