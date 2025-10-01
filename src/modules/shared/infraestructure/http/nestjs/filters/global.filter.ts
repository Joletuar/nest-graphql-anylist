import { ForbiddenError } from '@nestjs/apollo';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { ValidationError } from 'class-validator';
import { Response } from 'express';
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
  catch(exception: unknown, host: ArgumentsHost): void {
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
      const res = exception.getResponse() as {
        message: ValidationError[] | string[] | string;
        error: string;
        statusCode: number;
      };

      if (exception instanceof BadRequestException) {
        if (
          Array.isArray(res.message) &&
          res.message[0] instanceof ValidationError
        ) {
          const { message } = res as { message: ValidationError[] };

          formattedError = {
            ...formattedError,
            details: message.map(({ property, constraints }) => ({
              field: property,
              cause: Object.values(constraints!).map((value) => value),
            })),
          };
        } else if (
          Array.isArray(res.message) &&
          typeof res.message[0] === 'string'
        ) {
          const { message } = res as { message: string[] };

          formattedError = {
            ...formattedError,
            details: message.map((message) => ({ cause: message })),
          };
        } else {
          const { message } = res as { message: string };

          formattedError = {
            ...formattedError,
            details: [{ cause: message }],
          };
        }
      }

      if (exception instanceof UnauthorizedException) {
        const { message } = res as { message: string };

        formattedError = {
          message: 'Unauthorized',
          statusCode: HttpStatus.UNAUTHORIZED,
          details: [{ cause: message }],
        };
      }

      if (exception instanceof ForbiddenError) {
        const { message } = res as { message: string };

        formattedError = {
          message: 'Forbidden',
          statusCode: HttpStatus.FORBIDDEN,
          details: [{ cause: message }],
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

    const contextType = host.getType<'http' | 'graphql'>();

    if (contextType === 'graphql') {
      throw new GraphQLError(formattedError.message, {
        extensions: {
          error: formattedError,
        },
      });
    } else {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      response.status(formattedError.statusCode).json({
        statusCode: formattedError.statusCode,
        message: formattedError.message,
        details: formattedError.details,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
