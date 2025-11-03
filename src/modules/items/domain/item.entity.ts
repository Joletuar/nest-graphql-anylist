import { RootAggregate } from '@modules/shared/domain/root.aggegate';
import { RootValueObject } from '@modules/shared/domain/value-objects/root.value-object';

import { ItemId } from './value-objects/item-id.value-object';
import { ItemName } from './value-objects/item-name.value-object';
import { ItemQuantityUnits } from './value-objects/item-quantity-units.value-object';
import { ItemStock } from './value-objects/item-stock.value-object';
import { ItemUserId } from './value-objects/item-user-id.value-object';

type Props = {
  id: ItemId;

  name: ItemName;

  stock: ItemStock;

  quantityUnits: ItemQuantityUnits;

  userId: ItemUserId;
};

type Primitives = {
  [prop in keyof Props]: Props[prop] extends RootValueObject<infer U>
    ? U
    : unknown;
};

export class Item extends RootAggregate {
  static fromPrimitives(primitives: Primitives): Item {
    const { id, name, stock, quantityUnits, userId } = primitives;

    return new this({
      id: new ItemId(id),
      name: new ItemName(name),
      stock: new ItemStock(stock),
      quantityUnits: new ItemQuantityUnits(quantityUnits),
      userId: new ItemUserId(userId),
    });
  }

  constructor(private props: Props) {
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

  toPrimitives(): Primitives {
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
