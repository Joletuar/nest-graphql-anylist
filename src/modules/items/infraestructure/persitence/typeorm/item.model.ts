import { BaseModel } from 'src/modules/shared/infraestructure/persitence/typeorm/base.model';
import { Column, Entity } from 'typeorm';

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
}
