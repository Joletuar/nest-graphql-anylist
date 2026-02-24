import { Test, TestingModule } from '@nestjs/testing';

import { createMockItemRepository } from '@items/__tests__/mocks/item-repository.mock';
import { ItemMother } from '@items/__tests__/mothers/item.mother';
import { ItemNotFoundException } from '@items/domain/exceptions/item-not-found.exception';
import { ItemRepository } from '@items/domain/item.repository';

import { UpdateItemCommand } from './update-item.command';
import { UpdateItemCommandHandler } from './update-item.command-handler';

describe('UpdateItemCommandHandler', () => {
  let moduleRef: TestingModule;
  let handler: UpdateItemCommandHandler;
  let repository: jest.Mocked<ItemRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        UpdateItemCommandHandler,
        { provide: ItemRepository, useValue: createMockItemRepository() },
      ],
    }).compile();

    handler = moduleRef.get(UpdateItemCommandHandler);
    repository = moduleRef.get(ItemRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should update existing item with partial fields', async () => {
    // Arrange
    const currentItem = ItemMother.create({
      name: 'Rice',
      stock: 10,
      quantityUnits: 'kg',
    });
    const command = new UpdateItemCommand(currentItem.id, undefined, 20);

    repository.findById.mockResolvedValue(currentItem);
    repository.update.mockImplementation(async (item) => item);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(repository.findById).toHaveBeenCalledWith(currentItem.id);
    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: currentItem.id,
        name: 'Rice',
        stock: 20,
        quantityUnits: 'kg',
        userId: currentItem.userId,
      }),
    );
    expect(result.stock).toBe(20);
    expect(result.name).toBe('Rice');
  });

  it('should throw ItemNotFoundException when item does not exist', async () => {
    // Arrange
    const command = new UpdateItemCommand('missing-item-id', 'Rice');
    repository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      ItemNotFoundException,
    );
    expect(repository.update).not.toHaveBeenCalled();
  });
});
