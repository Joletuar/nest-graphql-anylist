import { ErrorObject } from '../base.error';

export abstract class DomainException extends Error {
  readonly layer = 'Domain';

  constructor(readonly errorObject: ErrorObject) {
    const { message } = errorObject;

    super(message);

    this.name = this.constructor.name;
  }
}
