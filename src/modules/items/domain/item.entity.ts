import { Primitives } from '@modules/shared/domain/primitves.type';
import { RootAggregate } from '@modules/shared/domain/root.aggegate';

import { ItemId } from './value-objects/item-id.value-object';
import { ItemName } from './value-objects/item-name.value-object';
import { ItemQuantityUnits } from './value-objects/item-quantity-units.value-object';
import { ItemStock } from './value-objects/item-stock.value-object';
import { ItemUserId } from './value-objects/item-user-id.value-object';

type ItemProps = {
  id: ItemId;

  name: ItemName;

  stock: ItemStock;

  quantityUnits: ItemQuantityUnits;

  userId: ItemUserId;
};

type ItemPrimitives = Primitives<ItemProps>;

export class Item extends RootAggregate {
  static fromPrimitives(primitives: ItemPrimitives): Item {
    const { id, name, stock, quantityUnits, userId } = primitives;

    return new this({
      id: new ItemId(id),
      name: new ItemName(name),
      stock: new ItemStock(stock),
      quantityUnits: new ItemQuantityUnits(quantityUnits),
      userId: new ItemUserId(userId),
    });
  }

  constructor(private props: ItemProps) {
    super();
  }

  get idValue(): string {
    return this.props.id.value;
  }

  get userId(): ItemUserId {
    return this.props.userId;
  }

  get userIdValue(): string {
    return this.props.userId.value;
  }

  toPrimitives(): ItemPrimitives {
    return {
      id: this.props.id.value,
      name: this.props.name.value,
      stock: this.props.stock.value,
      quantityUnits: this.props.quantityUnits.value,
      userId: this.props.userId.value,
    };
  }

  decreaseStock(amount: number): void {
    const currentStock = this.props.stock.value;

    this.props.stock = new ItemStock(currentStock - amount);
  }

  incrementStock(amount: number): void {
    const currentStock = this.props.stock.value;

    this.props.stock = new ItemStock(currentStock + amount);
  }
}
