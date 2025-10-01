import { ItemModel } from 'src/modules/items/infrastructure/persistence/typeorm/item.model';
import { UserModel } from 'src/modules/users/infrastructure/persistence/typeorm/user.model';
import { ulid } from 'ulidx';

import { Seeder } from './seeder.abstract';

export class ItemSeeder extends Seeder {
  async run(): Promise<void> {
    const itemRepository = this.dataSource.getRepository(ItemModel);

    const existingItems = await itemRepository.count();

    if (existingItems > 0) {
      console.log('Ya existen items en la base de datos, saltando seed...');

      return;
    }

    const users = await this.dataSource.getRepository(UserModel).find();

    if (users.length === 0) {
      console.log(
        'No hay usuarios disponibles para asignar items, saltando seed...',
      );

      return;
    }

    const itemsData: Partial<ItemModel>[] = [
      {
        id: ulid(),
        name: 'Leche',
        quantity: 2,
        quantityUnits: 'liters',
        userId: users[0].id,
      },
      {
        id: ulid(),
        name: 'Pan',
        quantity: 1,
        quantityUnits: 'loaf',
        userId: users[0].id,
      },
      {
        id: ulid(),
        name: 'Huevos',
        quantity: 12,
        quantityUnits: 'pieces',
        userId: users[1].id,
      },
      {
        id: ulid(),
        name: 'Frutas',
        quantity: 5,
        quantityUnits: 'kg',
        userId: users[1].id,
      },
    ];

    const items = itemRepository.create(itemsData);

    await itemRepository.insert(items);

    console.log(`Se crearon ${items.length} items de ejemplo.`);
  }
}
