import { Command } from '@nestjs/cqrs';

import { ItemDto } from '../../item.dto';
import { UpdateItemDto } from './update-item.dto';

export class UpdateItemCommand extends Command<ItemDto> {
  constructor(readonly dto: UpdateItemDto) {
    super();
  }
}
