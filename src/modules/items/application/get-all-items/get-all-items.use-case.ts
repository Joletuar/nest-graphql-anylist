import { ItemRepository } from '../../domain/item.repository';

export class GetAllItems {
  constructor(private readonly repository: ItemRepository) {}
}
