import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { isValid } from 'ulidx';

@Injectable()
export class ParseUlidPipe implements PipeTransform {
  transform(value: string): string {
    if (isValid(value)) return value;

    throw new BadRequestException(`The <${value}> is not a valid ulid.`);
  }
}
