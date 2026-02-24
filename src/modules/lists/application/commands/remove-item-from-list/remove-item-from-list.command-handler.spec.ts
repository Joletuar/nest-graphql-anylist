import { Test, TestingModule } from '@nestjs/testing';

import { createMockItemRepository } from '@items/__tests__/mocks/item-repository.mock';
import { ItemMother } from '@items/__tests__/mothers/item.mother';
import { ItemRepository } from '@items/domain/item.repository';
import { createMockListRepository } from '@lists/__tests__/mocks/list-repository.mock';
import { ListItemMother } from '@lists/__tests__/mothers/list-item.mother';
import { ListMother } from '@lists/__tests__/mothers/list.mother';
import { ItemNotFoundException } from '@lists/domain/exceptions/item-not-found.exception';
import { ListItemNotFoundException } from '@lists/domain/exceptions/list-item-not-found.exception';
import { ListNotFoundException } from '@lists/domain/exceptions/list-not-found.exception';
import { ListRespository } from '@lists/domain/list.repository';

import { RemoveItemFromListCommand } from './remove-item-from-list.command';
import { RemoveItemFromListCommandHandler } from './remove-item-from-list.command-handler';

describe('RemoveItemFromListCommandHandler', () => {
  let moduleRef: TestingModule;
  let handler: RemoveItemFromListCommandHandler;
  let listRepository: jest.Mocked<ListRespository>;
  let itemRepository: jest.Mocked<ItemRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        RemoveItemFromListCommandHandler,
        { provide: ListRespository, useValue: createMockListRepository() },
        { provide: ItemRepository, useValue: createMockItemRepository() },
      ],
    }).compile();

    handler = moduleRef.get(RemoveItemFromListCommandHandler);
    listRepository = moduleRef.get(ListRespository);
    itemRepository = moduleRef.get(ItemRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should remove item from list', async () => {
    // Arrange
    const item = ItemMother.create();
    const list = ListMother.create({
      items: [ListItemMother.create({ itemId: item.id, quantity: 2 })],
    });
    const command = new RemoveItemFromListCommand(list.id, item.id);

    listRepository.findById.mockResolvedValue(list);
    listRepository.update.mockImplementation(async (input) => input);

    // Act
    await handler.execute(command);

    // Assert
    expect(listRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({ items: [] }),
    );
  });

  it('should throw ListNotFoundException when list does not exist', async () => {
    // Arrange
    const command = new RemoveItemFromListCommand('missing-list-id', 'item-id');
    listRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      ListNotFoundException,
    );
  });

  it('should throw ListItemNotFoundException when item is not in list', async () => {
    // Arrange
    const list = ListMother.create({ items: [] });
    const command = new RemoveItemFromListCommand(list.id, 'missing-item-id');

    listRepository.findById.mockResolvedValue(list);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      ListItemNotFoundException,
    );
  });

  it('should throw ItemNotFoundException when updated list has unknown item', async () => {
    // Arrange
    const item = ItemMother.create();
    const list = ListMother.create({
      items: [ListItemMother.create({ itemId: item.id, quantity: 1 })],
    });
    const command = new RemoveItemFromListCommand(list.id, item.id);

    listRepository.findById.mockResolvedValue(list);
    listRepository.update.mockResolvedValue(
      ListMother.create({
        id: list.id,
        items: [
          ListItemMother.create({ itemId: 'missing-item-id', quantity: 1 }),
        ],
      }),
    );
    itemRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      ItemNotFoundException,
    );
  });
});
