import { Test, TestingModule } from '@nestjs/testing';

import { createMockItemRepository } from '@items/__tests__/mocks/item-repository.mock';
import { ItemMother } from '@items/__tests__/mothers/item.mother';
import { UserNotFoundException } from '@items/domain/exceptions/user-not-found.exception';
import { ItemRepository } from '@modules/items/domain/item.repository';
import { createMockUserRepository } from '@users/__tests__/mocks/user-repository.mock';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { UserRepository } from '@users/domain/user.repository';

import { GetAllItemsQueryHandler } from './get-all-items.query-handler';

describe('GetAllItemsQueryHandler', () => {
  let moduleRef: TestingModule;
  let handler: GetAllItemsQueryHandler;
  let itemRepository: jest.Mocked<ItemRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        GetAllItemsQueryHandler,
        { provide: ItemRepository, useValue: createMockItemRepository() },
        { provide: UserRepository, useValue: createMockUserRepository() },
      ],
    }).compile();

    handler = moduleRef.get(GetAllItemsQueryHandler);
    itemRepository = moduleRef.get(ItemRepository);
    userRepository = moduleRef.get(UserRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should return all items with users', async () => {
    // Arrange
    const user = UserMother.create();
    const items = [
      ItemMother.create({ userId: user.id }),
      ItemMother.create({ userId: user.id }),
    ];
    itemRepository.getAll.mockResolvedValue(items);
    userRepository.findById.mockResolvedValue(user);

    // Act
    const result = await handler.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when there are no items', async () => {
    // Arrange
    itemRepository.getAll.mockResolvedValue([]);

    // Act
    const result = await handler.execute();

    // Assert
    expect(result).toEqual([]);
    expect(userRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    // Arrange
    const item = ItemMother.create();
    itemRepository.getAll.mockResolvedValue([item]);
    userRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute()).rejects.toThrow(UserNotFoundException);
  });
});
