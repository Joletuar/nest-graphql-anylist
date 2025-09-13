import { Query } from '@nestjs/cqrs';

import { ItemDto } from '../../item.dto';

export class GetAllItemsQuery extends Query<ItemDto[]> {}
