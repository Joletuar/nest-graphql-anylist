import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { isValid } from 'ulidx';

@Injectable()
export class ParseUlidPipe<TData extends object = object>
  implements PipeTransform
{
  constructor(private readonly property?: keyof TData) {}

  transform(value: string): string;
  transform(value: TData): TData;
  transform(value: string | TData): string | TData {
    if (typeof value === 'string') return this.validateString(value);

    return this.validateObject(value);
  }

  private validateString(value: string): string {
    if (isValid(value)) return value;

    throw new BadRequestException(`The <${value}> is not a valid ulid.`);
  }

  private validateObject(value: TData): TData {
    if (!this.property) {
      throw new BadRequestException(
        'Property is required for object validation',
      );
    }

    const propertyValue = value[this.property];

    if (typeof propertyValue !== 'string') {
      throw new BadRequestException(
        `The property <${String(
          this.property,
        )}> is not a string in the object.`,
      );
    }

    if (!isValid(propertyValue)) {
      throw new BadRequestException(
        `The property <${String(
          this.property,
        )}> with value <${propertyValue}> is not a valid ulid.`,
      );
    }

    return value;
  }
}
