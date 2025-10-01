import 'reflect-metadata';

import { AppDataSource } from '../typeorm.config';
import { SeederConstructor } from './seeder.abstract';
import { UserSeeder } from './user.seeder';

// import { ItemSeeder } from './item.seeder';

const seeders: SeederConstructor[] = [
  UserSeeder,
  // ItemSeeder,
];

async function runSeeds(): Promise<void> {
  try {
    console.log('Inicializando conexión a la base de datos...');

    await AppDataSource.initialize();
    console.log('Conexión establecida');
    console.log('Ejecutando seeds...');

    for (const SeederClass of seeders) {
      const seederInstance = new SeederClass(AppDataSource);
      const seederName = SeederClass.name;

      console.log(`Ejecutando ${seederName}...`);
      await seederInstance.run();
      console.log(`${seederName} completado`);
    }

    console.log('Todos los seeds han sido ejecutados exitosamente');
  } catch (error) {
    console.error('Error ejecutando seeds:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();

      console.log('Conexión cerrada');
    }
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  void runSeeds();
}

export { runSeeds };
