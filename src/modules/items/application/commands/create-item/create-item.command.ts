import { Command } from '@nestjs/cqrs';

import { ItemDto } from '../../item.dto';
import { CreateItemDto } from './create-item.dto';

export class CreateItemCommand extends Command<ItemDto> {
  constructor(readonly dto: CreateItemDto) {
    super();
  }
}
