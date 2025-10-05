import { Role } from '@users/domain/roles.enum';
import { UserModel } from '@users/infrastructure/persistence/typeorm/user.model';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ulid } from 'ulidx';

import { Seeder } from './seeder.abstract';

export class UserSeeder extends Seeder {
  async run(): Promise<void> {
    const userRepository: Repository<UserModel> =
      this.dataSource.getRepository(UserModel);

    const existingUsers = await userRepository.count();

    if (existingUsers > 0) {
      console.log('Ya existen usuarios en la base de datos, saltando seed...');

      return;
    }

    const usersData: Partial<UserModel>[] = [
      {
        id: ulid(),
        email: 'admin@example.com',
        password: await bcrypt.hash('ABCD1234', 10),
        fullName: 'Administrador',
        roles: [Role.ADMIN],
        isActive: true,
      },
      {
        id: ulid(),
        email: 'user@example.com',
        password: await bcrypt.hash('ABCD1234', 10),
        fullName: 'Usuario de Prueba',
        roles: [Role.GUEST],
        isActive: true,
      },
    ];

    const users = userRepository.create(usersData);
    await userRepository.insert(users);

    console.log(`Se crearon ${users.length} usuarios de ejemplo`);
  }
}
