import { BaseModel } from '@modules/shared/infrastructure/persistence/typeorm/base.model';
import { UserModel } from '@modules/users/infrastructure/persistence/typeorm/user.model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'items' })
export class ItemModel extends BaseModel {
  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'stock',
  })
  stock: number;

  @Column({
    name: 'quantity_units',
  })
  quantityUnits: string;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @ManyToOne(() => UserModel, (user) => user.items, { lazy: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Promise<UserModel>;
}
