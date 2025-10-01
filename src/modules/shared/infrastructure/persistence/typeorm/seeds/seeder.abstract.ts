import { DataSource } from 'typeorm';

export abstract class Seeder {
  constructor(protected dataSource: DataSource) {}

  abstract run(): Promise<void>;
}

export interface SeederConstructor {
  new (dataSource: DataSource): Seeder;
}
