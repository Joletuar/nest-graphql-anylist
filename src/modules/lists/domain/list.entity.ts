import { ListItem } from './list-item.entity';

export interface List {
  id: string;

  name: string;

  userId: string;

  items: ListItem[];
}
