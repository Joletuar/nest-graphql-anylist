import { Test, TestingModule } from '@nestjs/testing';

import { createMockItemRepository } from '@items/__tests__/mocks/item-repository.mock';
import { ItemMother } from '@items/__tests__/mothers/item.mother';
import { ItemRepository } from '@items/domain/item.repository';
import { createMockListRepository } from '@lists/__tests__/mocks/list-repository.mock';
import { ListItemMother } from '@lists/__tests__/mothers/list-item.mother';
import { ListMother } from '@lists/__tests__/mothers/list.mother';
import { ItemNotFoundException } from '@lists/domain/exceptions/item-not-found.exception';
import { ListNotFoundException } from '@lists/domain/exceptions/list-not-found.exception';
import { ListRespository } from '@lists/domain/list.repository';

import { AddItemToListCommand } from './add-item-to-list.command';
import { AddItemToListCommandHandler } from './add-item-to-list.command-handler';

describe('AddItemToListCommandHandler', () => {
  let moduleRef: TestingModule;
  let handler: AddItemToListCommandHandler;
  let listRepository: jest.Mocked<ListRespository>;
  let itemRepository: jest.Mocked<ItemRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AddItemToListCommandHandler,
        { provide: ListRespository, useValue: createMockListRepository() },
        { provide: ItemRepository, useValue: createMockItemRepository() },
      ],
    }).compile();

    handler = moduleRef.get(AddItemToListCommandHandler);
    listRepository = moduleRef.get(ListRespository);
    itemRepository = moduleRef.get(ItemRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should add a new item to list', async () => {
    // Arrange
    const item = ItemMother.create();
    const list = ListMother.create({ items: [] });
    const updatedList = ListMother.create({
      id: list.id,
      userId: list.userId,
      name: list.name,
      items: [ListItemMother.create({ itemId: item.id, quantity: 2 })],
    });
    const command = new AddItemToListCommand(list.id, item.id, 2);

    listRepository.findById.mockResolvedValue(list);
    itemRepository.findById.mockResolvedValue(item);
    listRepository.update.mockResolvedValue(updatedList);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(listRepository.update).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(list.id);
  });

  it('should increase quantity when item already exists in list', async () => {
    // Arrange
    const item = ItemMother.create();
    const list = ListMother.create({
      items: [ListItemMother.create({ itemId: item.id, quantity: 1 })],
    });
    const command = new AddItemToListCommand(list.id, item.id, 3);

    listRepository.findById.mockResolvedValue(list);
    itemRepository.findById.mockResolvedValue(item);
    listRepository.update.mockImplementation(async (input) => input);

    // Act
    await handler.execute(command);

    // Assert
    expect(listRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({ itemId: item.id, quantity: 4 }),
        ]),
      }),
    );
  });

  it('should throw ListNotFoundException when list does not exist', async () => {
    // Arrange
    const command = new AddItemToListCommand('missing-list-id', 'item-id', 1);
    listRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      ListNotFoundException,
    );
  });

  it('should throw ItemNotFoundException when item does not exist', async () => {
    // Arrange
    const list = ListMother.create();
    const command = new AddItemToListCommand(list.id, 'missing-item-id', 1);

    listRepository.findById.mockResolvedValue(list);
    itemRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      ItemNotFoundException,
    );
  });
});
