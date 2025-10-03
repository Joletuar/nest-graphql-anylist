import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ItemModel } from '../../../../items/infrastructure/persistence/typeorm/item.model';
import { BaseModel } from '../../../../shared/infrastructure/persistence/typeorm/base.model';
import { ListModel } from './list.model';

@Entity({ name: 'list_items' })
export class ListItemModel extends BaseModel {
  @Column({
    name: 'item_id',
  })
  itemId: string;

  @Column({
    name: 'list_id',
  })
  listId: string;

  @Column({
    name: 'quantity',
  })
  quantity: number;

  @ManyToOne(() => ItemModel, { lazy: true })
  @JoinColumn({ name: 'item_id', referencedColumnName: 'id' })
  item: Promise<ItemModel>;

  @ManyToOne(() => ListModel, (list) => list.items, { lazy: true })
  @JoinColumn({ name: 'list_id', referencedColumnName: 'id' })
  list: Promise<ListModel>;
}
