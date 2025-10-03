import { Command } from '@nestjs/cqrs';

import { ListDto } from '../../list.dto';

export class UpdateListCommand extends Command<ListDto> {
  constructor(
    readonly id: string,
    readonly name?: string,
    readonly userId?: string,
    readonly items?: { id: string; itemId: string; quantity: number }[],
  ) {
    super();
  }
}
