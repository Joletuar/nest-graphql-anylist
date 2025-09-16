import { ErrorObject } from '../errors/base.error';

interface InfraestructureErrorObject extends ErrorObject {
  originalError: unknown;
}

export abstract class InfraestructureException extends Error {
  readonly layer = 'Infraestructure';

  constructor(readonly errorObject: InfraestructureErrorObject) {
    const { message } = errorObject;

    super(message);

    this.name = this.constructor.name;
  }
}
