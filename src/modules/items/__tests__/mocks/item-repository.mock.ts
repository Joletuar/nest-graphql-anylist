import { ItemRepository } from '@items/domain/item.repository';

export const createMockItemRepository = (): jest.Mocked<ItemRepository> => ({
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  search: jest.fn(),
});
