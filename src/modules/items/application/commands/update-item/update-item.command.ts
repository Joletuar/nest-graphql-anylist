import { Command } from '@nestjs/cqrs';

import { ItemDto } from '../../item.dto';

export class UpdateItemCommand extends Command<ItemDto> {
  constructor(
    readonly id: string,
    readonly name?: string,
    readonly stock?: number,
    readonly quantityUnits?: string,
    readonly userId?: string,
  ) {
    super();
  }
}
