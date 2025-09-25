import { InfraestructureException } from 'src/modules/shared/domain/exceptions/infraestructure.exception';

export class JwtException extends InfraestructureException {
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
