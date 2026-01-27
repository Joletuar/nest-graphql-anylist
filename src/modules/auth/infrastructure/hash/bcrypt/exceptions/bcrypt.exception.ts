import { InfrastructureException } from '@modules/shared/domain/exceptions/infrastructure.exception';

export class BcryptException extends InfrastructureException {
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
