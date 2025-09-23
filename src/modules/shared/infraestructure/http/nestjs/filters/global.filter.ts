import {
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  ValidationError,
} from '@nestjs/common';

import { GraphQLError } from 'graphql';

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

    throw new GraphQLError(formattedError.message, {
      extensions: {
        error: formattedError,
      },
    });
  }
}
