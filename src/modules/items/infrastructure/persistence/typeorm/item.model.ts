import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseModel } from '../../../../shared/infrastructure/persistence/typeorm/base.model';
import { UserModel } from '../../../../users/infrastructure/persistence/typeorm/user.model';

@Entity({ name: 'items' })
export class ItemModel extends BaseModel {
  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'quantity',
  })
  quantity: number;

  @Column({
    name: 'quantity_units',
  })
  quantityUnits: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserModel, (user) => user.items, { lazy: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Promise<UserModel>;
}
