import { BaseModel } from '@shared/infrastructure/persistence/typeorm/base.model';
import { UserModel } from '@users/infrastructure/persistence/typeorm/user.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { ListItemModel } from './list-item.model';

@Entity({ name: 'lists' })
export class ListModel extends BaseModel {
  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @ManyToOne(() => UserModel, { lazy: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Promise<UserModel>;

  @OneToMany(() => ListItemModel, (listItem) => listItem.list, {
    lazy: true,
  })
  items: Promise<ListItemModel[]>;
}
