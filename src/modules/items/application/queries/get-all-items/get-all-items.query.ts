import { Query } from '@nestjs/cqrs';

import { QueryItemDto } from '../query-item.dto';

export class GetAllItemsQuery extends Query<QueryItemDto[]> {}
