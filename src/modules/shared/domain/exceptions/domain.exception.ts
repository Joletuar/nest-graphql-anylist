interface ErrorObject {
  readonly message: string;

  readonly details: Detail[];
}

interface Detail {
  cause: string;
}

export class DomainException extends Error {
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
