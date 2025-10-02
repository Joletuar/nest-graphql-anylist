import { Query } from '@nestjs/cqrs';

import { ListDto } from '../../list.dto';

export class GetAllListsQuery extends Query<ListDto[]> {}
