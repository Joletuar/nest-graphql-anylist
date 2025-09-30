import {
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ValidationError,
} from '@nestjs/common';

import { GraphQLError } from 'graphql';
import { DomainException } from 'src/modules/shared/domain/exceptions/domain.exception';
import { InfraestructureException } from 'src/modules/shared/domain/exceptions/infraestructure.exception';

type FormattedError = {
  message: string;
  statusCode: number;
  details: { field?: string; cause: string | string[] }[];
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(this.constructor.name);
  catch(exception: unknown): void {
    this.logger.error(exception);

    let formattedError: FormattedError = {
      message: 'Validation error',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      details: [
        {
          cause: 'Internal Server Error',
        },
      ],
    };

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'object') {
        const { message, statusCode } = res as {
          message: string;
          statusCode: number;
        };

        formattedError = {
          message,
          statusCode,
          details: [
            {
              cause: message,
            },
          ],
        };
      }
    }

    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as {
        message: ValidationError[] | string;
        error: string;
        statusCode: number;
      };

      if (Array.isArray(res.message)) {
        formattedError = {
          ...formattedError,
          details: res.message.map(({ property, constraints }) => ({
            field: property,
            cause: Object.values(constraints!).map((value) => value),
          })),
        };
      } else {
        formattedError = {
          ...formattedError,
          details: [{ cause: res.message }],
        };
      }
    }

    if (exception instanceof DomainException) {
      const { errorObject, message } = exception;

      formattedError = {
        message,
        statusCode: HttpStatus.BAD_REQUEST,
        details: errorObject.details,
      };
    }

    if (exception instanceof InfraestructureException) {
      const { errorObject, message } = exception;

      formattedError = {
        message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: errorObject.details,
      };
    }

    throw new GraphQLError(formattedError.message, {
      extensions: {
        error: formattedError,
      },
    });
  }
}
