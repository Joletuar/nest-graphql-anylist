import { Test, TestingModule } from '@nestjs/testing';

import { createMockItemRepository } from '@items/__tests__/mocks/item-repository.mock';
import { ItemMother } from '@items/__tests__/mothers/item.mother';
import { ItemNotFoundException } from '@items/domain/exceptions/item-not-found.exception';
import { UserNotFoundException } from '@items/domain/exceptions/user-not-found.exception';
import { ItemRepository } from '@items/domain/item.repository';
import { createMockUserRepository } from '@users/__tests__/mocks/user-repository.mock';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { UserRepository } from '@users/domain/user.repository';

import { FindItemByIdQuery } from './find-item-by-id.query';
import { FinItemByIdQueryHandler } from './find-item-by-id.query-handler';

describe('FinItemByIdQueryHandler', () => {
  let moduleRef: TestingModule;
  let handler: FinItemByIdQueryHandler;
  let itemRepository: jest.Mocked<ItemRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        FinItemByIdQueryHandler,
        { provide: ItemRepository, useValue: createMockItemRepository() },
        { provide: UserRepository, useValue: createMockUserRepository() },
      ],
    }).compile();

    handler = moduleRef.get(FinItemByIdQueryHandler);
    itemRepository = moduleRef.get(ItemRepository);
    userRepository = moduleRef.get(UserRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should return query item dto', async () => {
    // Arrange
    const user = UserMother.create();
    const item = ItemMother.create({ userId: user.id });
    const query = new FindItemByIdQuery(item.id);
    itemRepository.findById.mockResolvedValue(item);
    userRepository.findById.mockResolvedValue(user);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(itemRepository.findById).toHaveBeenCalledWith(item.id);
    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    expect(result).toEqual(
      expect.objectContaining({
        id: item.id,
        name: item.name,
        stock: item.stock,
        quantityUnits: item.quantityUnits,
        user: expect.objectContaining({
          id: user.id,
          email: user.email,
        }),
      }),
    );
  });

  it('should throw ItemNotFoundException when item does not exist', async () => {
    // Arrange
    const query = new FindItemByIdQuery('missing-item-id');
    itemRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(query)).rejects.toThrow(ItemNotFoundException);
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    // Arrange
    const item = ItemMother.create();
    const query = new FindItemByIdQuery(item.id);
    itemRepository.findById.mockResolvedValue(item);
    userRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(query)).rejects.toThrow(UserNotFoundException);
  });
});
