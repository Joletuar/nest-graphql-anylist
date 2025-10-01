import { BaseModel } from 'src/modules/shared/infrastructure/persitence/typeorm/base.model';
import { UserModel } from 'src/modules/users/infrastructure/persitence/typeorm/user.model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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
