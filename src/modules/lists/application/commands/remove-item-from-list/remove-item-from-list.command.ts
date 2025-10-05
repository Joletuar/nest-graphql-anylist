import { Command } from '@nestjs/cqrs';

import { ListDto } from '../../list.dto';

export class RemoveItemFromListCommand extends Command<ListDto> {
  constructor(
    readonly listId: string,
    readonly itemId: string,
  ) {
    super();
  }
}
