import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemModel } from '../persitence/typeorm/item.model';
import { ItemsResolver } from './items.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ItemModel])],

  providers: [ItemsResolver],
})
export class ItemsModule {}
