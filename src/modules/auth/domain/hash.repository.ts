export abstract class HashRepository {
  abstract hash(value: string): Promise<string>;

  abstract validate(
    hashedValue: string,
    originalValue: string,
  ): Promise<boolean>;
}
