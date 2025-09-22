import { Command } from '@nestjs/cqrs';

import { ItemDto } from '../../item.dto';

export class CreateItemCommand extends Command<ItemDto> {
  constructor(
    readonly name: string,
    readonly quantity: number,
    readonly quantityUnits: string,
  ) {
    super();
  }
}
