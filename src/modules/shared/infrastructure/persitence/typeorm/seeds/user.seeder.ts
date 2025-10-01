import * as bcrypt from 'bcrypt';
import { Role } from 'src/modules/users/domain/roles.enum';
import { UserModel } from 'src/modules/users/infrastructure/persitence/typeorm/user.model';
import { Repository } from 'typeorm';

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

    const usersData = [
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('ABCD1234', 10),
        fullName: 'Administrador',
        roles: [Role.ADMIN],
        isActive: true,
      },
      {
        email: 'user@example.com',
        password: await bcrypt.hash('ABCD1234', 10),
        fullName: 'Usuario de Prueba',
        roles: [Role.GUEST],
        isActive: true,
      },
    ];

    const users = userRepository.create(usersData);
    await userRepository.save(users);

    console.log(`Se crearon ${users.length} usuarios de ejemplo`);
  }
}
