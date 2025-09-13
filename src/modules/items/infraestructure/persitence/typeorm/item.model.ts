import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'items' })
export class ItemModel {
  @PrimaryColumn({
    name: 'id',
  })
  id: string;

  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'name',
  })
  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'quantity_units' })
  quantityUnits: string;
}
