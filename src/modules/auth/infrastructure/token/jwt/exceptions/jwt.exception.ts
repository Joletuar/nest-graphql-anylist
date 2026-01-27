import { InfrastructureException } from '@modules/shared/domain/exceptions/infrastructure.exception';

export class JwtException extends InfrastructureException {
  constructor(error: unknown) {
    super({
      message: 'Jwt error',
      details: [
        {
          cause:
            'An error has been ocurred to perform JWT operations. Check logs.',
        },
      ],
      originalError: error,
    });

    this.name = this.constructor.name;
  }
}
