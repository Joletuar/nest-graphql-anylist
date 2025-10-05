import { Criteria } from 'src/modules/shared/domain/criteria/criteria.interface';
import { Paginated } from 'src/modules/shared/domain/paginated.entity';

import { ListItem } from './list-item.entity';

export abstract class ListItemRepository {
  abstract search(criteria: Criteria): Promise<Paginated<ListItem>>;
}
