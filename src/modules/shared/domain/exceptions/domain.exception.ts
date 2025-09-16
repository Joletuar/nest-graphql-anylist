import { ErrorObject } from '../errors/base.error';

export abstract class DomainException extends Error {
  readonly layer = 'Domain';

  constructor(readonly errorObject: ErrorObject) {
    const { message } = errorObject;

    super(message);

    this.name = this.constructor.name;
  }

  get error(): ErrorObject & { layer: string } {
    return {
      message: this.message,
      layer: this.layer,
      details: this.errorObject.details,
    };
  }
}
