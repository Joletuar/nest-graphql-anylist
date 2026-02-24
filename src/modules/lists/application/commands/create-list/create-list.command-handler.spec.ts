import { Test, TestingModule } from '@nestjs/testing';

import { createMockItemRepository } from '@items/__tests__/mocks/item-repository.mock';
import { ItemMother } from '@items/__tests__/mothers/item.mother';
import { ItemRepository } from '@items/domain/item.repository';
import { createMockListRepository } from '@lists/__tests__/mocks/list-repository.mock';
import { ItemNotFoundException } from '@lists/domain/exceptions/item-not-found.exception';
import { ListRespository } from '@lists/domain/list.repository';
import { ulid } from 'ulidx';

import { CreateListCommand } from './create-list.command';
import { CreateListCommandHandler } from './create-list.command-handler';

describe('CreateListCommandHandler', () => {
  let moduleRef: TestingModule;
  let handler: CreateListCommandHandler;
  let itemRepository: jest.Mocked<ItemRepository>;
  let listRepository: jest.Mocked<ListRespository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        CreateListCommandHandler,
        { provide: ItemRepository, useValue: createMockItemRepository() },
        { provide: ListRespository, useValue: createMockListRepository() },
      ],
    }).compile();

    handler = moduleRef.get(CreateListCommandHandler);
    itemRepository = moduleRef.get(ItemRepository);
    listRepository = moduleRef.get(ListRespository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should create list and return dto', async () => {
    // Arrange
    const userId = ulid();
    const item = ItemMother.create();
    const command = new CreateListCommand('Groceries', userId, [
      { itemId: item.id, quantity: 2 },
    ]);

    itemRepository.findById.mockResolvedValue(item);
    listRepository.create.mockImplementation(async (list) => list);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(itemRepository.findById).toHaveBeenCalledWith(item.id);
    expect(listRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(
      expect.objectContaining({
        name: 'Groceries',
        userId,
      }),
    );
  });

  it('should create list with empty items input', async () => {
    // Arrange
    const command = new CreateListCommand('Groceries', ulid(), []);
    listRepository.create.mockImplementation(async (list) => list);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(itemRepository.findById).not.toHaveBeenCalled();
    expect(result.name).toBe('Groceries');
  });

  it('should throw ItemNotFoundException when item does not exist', async () => {
    // Arrange
    const command = new CreateListCommand('Groceries', ulid(), [
      { itemId: 'missing-item-id', quantity: 1 },
    ]);
    itemRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      ItemNotFoundException,
    );
    expect(listRepository.create).not.toHaveBeenCalled();
  });
});
