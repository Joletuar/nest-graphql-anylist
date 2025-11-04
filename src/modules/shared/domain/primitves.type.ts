import { RootValueObject } from './value-objects/root.value-object';

export type Primitives<T> = {
  [prop in keyof T]: T[prop] extends RootValueObject<infer U> ? U : unknown;
};
