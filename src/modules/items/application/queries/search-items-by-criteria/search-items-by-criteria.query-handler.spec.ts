import { Test, TestingModule } from '@nestjs/testing';

import { createMockItemRepository } from '@items/__tests__/mocks/item-repository.mock';
import { ItemMother } from '@items/__tests__/mothers/item.mother';
import { UserNotFoundException } from '@items/domain/exceptions/user-not-found.exception';
import { ItemRepository } from '@items/domain/item.repository';
import { CriteriaMother } from '@shared/__tests__/mothers/criteria.mother';
import { PaginatedMother } from '@shared/__tests__/mothers/paginated.mother';
import { createMockUserRepository } from '@users/__tests__/mocks/user-repository.mock';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { UserRepository } from '@users/domain/user.repository';

import { SearchItemsByCriteriaQuery } from './search-items-by-criteria.query';
import { SearchItemsByCriteriaQueryHandler } from './search-items-by-criteria.query-handler';

describe('SearchItemsByCriteriaQueryHandler', () => {
  let moduleRef: TestingModule;
  let handler: SearchItemsByCriteriaQueryHandler;
  let itemRepository: jest.Mocked<ItemRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        SearchItemsByCriteriaQueryHandler,
        { provide: ItemRepository, useValue: createMockItemRepository() },
        { provide: UserRepository, useValue: createMockUserRepository() },
      ],
    }).compile();

    handler = moduleRef.get(SearchItemsByCriteriaQueryHandler);
    itemRepository = moduleRef.get(ItemRepository);
    userRepository = moduleRef.get(UserRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should return paginated items dto', async () => {
    // Arrange
    const user = UserMother.create();
    const item = ItemMother.create({ userId: user.id });
    const criteria = CriteriaMother.create();
    const query = new SearchItemsByCriteriaQuery(criteria);

    itemRepository.search.mockResolvedValue(PaginatedMother.create([item]));
    userRepository.findById.mockResolvedValue(user);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(itemRepository.search).toHaveBeenCalledWith(criteria);
    expect(result.items).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    // Arrange
    const item = ItemMother.create();
    const query = new SearchItemsByCriteriaQuery(CriteriaMother.create());

    itemRepository.search.mockResolvedValue(PaginatedMother.create([item]));
    userRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(query)).rejects.toThrow(UserNotFoundException);
  });
});
