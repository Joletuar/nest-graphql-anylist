export abstract class Query<T = unknown> {
  data: T;
}

export interface QueryClass {
  new (...args: unknown[]);
}
