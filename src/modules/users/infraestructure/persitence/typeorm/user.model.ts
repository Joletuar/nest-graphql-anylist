import { BaseModel } from 'src/modules/shared/infraestructure/persitence/typeorm/base.model';
import { Role } from 'src/modules/users/domain/roles.enum';
import { Column, Entity } from 'typeorm';

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
  email: string;

  @Column({
    name: 'password',
  })
  password: string;

  @Column({
    name: 'roles',
    enum: Object.values(Role).map((v) => v),
  })
  roles: Role[];

  @Column({
    name: 'is_active',
  })
  isActive: boolean;
}
