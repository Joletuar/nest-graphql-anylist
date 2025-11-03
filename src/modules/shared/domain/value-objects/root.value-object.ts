export abstract class RootValueObject<TData> {
  protected _value: TData;

  constructor(value: TData) {
    this._value = Object.freeze(value);
  }

  get value(): TData {
    return this._value;
  }

  isEquals(other: RootValueObject<unknown>): boolean {
    return JSON.stringify(this._value) === JSON.stringify(other);
  }

  toString(): string {
    return JSON.stringify(this._value, null, 2);
  }
}
