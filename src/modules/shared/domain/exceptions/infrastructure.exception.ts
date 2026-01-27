import { ErrorObject } from '../base.error';

export interface InfrastructureErrorObject extends ErrorObject {
  originalError: unknown;
}

export abstract class InfrastructureException extends Error {
  readonly layer = 'Infraestructure';

  constructor(readonly errorObject: InfrastructureErrorObject) {
    const { message } = errorObject;

    super(message);

    this.name = this.constructor.name;
  }
}
