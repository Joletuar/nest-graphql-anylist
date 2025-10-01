import { Column, Entity, Index, OneToMany } from 'typeorm';

import { ItemModel } from '../../../../items/infrastructure/persistence/typeorm/item.model';
import { BaseModel } from '../../../../shared/infrastructure/persistence/typeorm/base.model';
import { Role } from '../../../domain/roles.enum';

@Entity({
  name: 'users',
})
export class UserModel extends BaseModel {
  @Column({
    name: 'full_name',
  })
  fullName: string;

  @Column({
    name: 'email',
  })
  @Index({ unique: true })
  email: string;

  @Column({
    name: 'password',
  })
  password: string;

  @Column({
    name: 'roles',
    enum: Object.values(Role).map((v) => v),
    type: 'simple-array',
  })
  roles: Role[];

  @Column({
    name: 'is_active',
  })
  isActive: boolean;

  @OneToMany(() => ItemModel, (item) => item.user, { lazy: true })
  items: Promise<ItemModel[]>;
}
