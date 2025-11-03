export abstract class RootAggregate {
  isEquals(other: RootAggregate): boolean {
    return !(other instanceof RootAggregate);
  }
}
