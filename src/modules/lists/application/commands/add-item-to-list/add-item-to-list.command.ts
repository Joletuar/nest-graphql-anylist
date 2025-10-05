import { Command } from '@nestjs/cqrs';

import { ListDto } from '../../list.dto';

export class AddItemToListCommand extends Command<ListDto> {
  constructor(
    readonly listId: string,
    readonly itemId: string,
    readonly quantity: number,
  ) {
    super();
  }
}
