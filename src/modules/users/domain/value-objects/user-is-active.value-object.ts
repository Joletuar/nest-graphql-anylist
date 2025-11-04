import { BooleanValueObject } from '@modules/shared/domain/value-objects/boolean.value-objec';

export class UserIsActive extends BooleanValueObject {
  enable(): void {
    if (this._value === true) return;
    this._value = true;
  }

  disable(): void {
    if (this._value === false) return;
    this._value = false;
  }
}
