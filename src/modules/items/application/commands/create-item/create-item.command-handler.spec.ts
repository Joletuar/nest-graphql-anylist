import { Test, TestingModule } from '@nestjs/testing';

import { createMockItemRepository } from '@items/__tests__/mocks/item-repository.mock';
import { ItemRepository } from '@items/domain/item.repository';
import { ulid } from 'ulidx';

import { CreateItemCommand } from './create-item.command';
import { CreateItemCommandHandler } from './create-item.command-handler';

describe('CreateItemCommandHandler', () => {
  let moduleRef: TestingModule;
  let handler: CreateItemCommandHandler;
  let repository: jest.Mocked<ItemRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        CreateItemCommandHandler,
        { provide: ItemRepository, useValue: createMockItemRepository() },
      ],
    }).compile();

    handler = moduleRef.get(CreateItemCommandHandler);
    repository = moduleRef.get(ItemRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should create an item and return dto', async () => {
    // Arrange
    const command = new CreateItemCommand('Rice', 12, 'kg', ulid());
    repository.create.mockImplementation(async (item) => item);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Rice',
        stock: 12,
        quantityUnits: 'kg',
        userId: command.userId,
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        name: 'Rice',
        stock: 12,
        quantityUnits: 'kg',
        userId: command.userId,
      }),
    );
    expect(result.id).toBeDefined();
  });
});
