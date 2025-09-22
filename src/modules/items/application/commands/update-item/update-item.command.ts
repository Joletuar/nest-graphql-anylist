import { Command } from '@nestjs/cqrs';

import { ItemDto } from '../../item.dto';

export class UpdateItemCommand extends Command<ItemDto> {
  constructor(
    readonly id: string,
    readonly name?: string,
    readonly quantity?: number,
    readonly quantityUnits?: string,
  ) {
    super();
  }
}
