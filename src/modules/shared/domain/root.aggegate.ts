import { Primitives } from './primitves.type';

export abstract class RootAggregate {
  abstract toPrimitives(): Primitives<unknown>;

  isEquals(other: RootAggregate): boolean {
    return !(other instanceof RootAggregate);
  }
}
