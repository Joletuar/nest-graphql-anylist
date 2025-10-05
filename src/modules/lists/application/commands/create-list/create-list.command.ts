import { Command } from '@nestjs/cqrs';

import { ListDto } from '../../list.dto';

export class CreateListCommand extends Command<ListDto> {
  constructor(
    readonly name: string,
    readonly userId: string,
    readonly items?: { itemId: string; quantity: number }[],
  ) {
    super();
  }
}
