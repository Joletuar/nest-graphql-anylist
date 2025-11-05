import { InfraestructureException } from '@shared/domain/exceptions/infraestructure.exception';

export class BcryptException extends InfraestructureException {
  constructor(error: unknown) {
    super({
      message: 'Bcrypt error',
      details: [
        {
          cause:
            'An error has been ocurred to perform Hash operations. Check logs.',
        },
      ],
      originalError: error,
    });

    this.name = this.constructor.name;
  }
}
