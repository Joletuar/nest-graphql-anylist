import { Test, TestingModule } from '@nestjs/testing';

import { createMockListItemRepository } from '@lists/__tests__/mocks/list-item-repository.mock';
import { ListItemMother } from '@lists/__tests__/mothers/list-item.mother';
import { ListItemRepository } from '@modules/lists/domain/list-item.repository';
import { CriteriaMother } from '@shared/__tests__/mothers/criteria.mother';
import { PaginatedMother } from '@shared/__tests__/mothers/paginated.mother';

import { SearchListItemsByCriteriaQuery } from './search-list-items-by-criteria.query';
import { SearchListItemsByCriteriaQueryHandler } from './search-list-items-by-criteria.query-handler';

describe('SearchListItemsByCriteriaQueryHandler', () => {
  let moduleRef: TestingModule;
  let handler: SearchListItemsByCriteriaQueryHandler;
  let repository: jest.Mocked<ListItemRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        SearchListItemsByCriteriaQueryHandler,
        {
          provide: ListItemRepository,
          useValue: createMockListItemRepository(),
        },
      ],
    }).compile();

    handler = moduleRef.get(SearchListItemsByCriteriaQueryHandler);
    repository = moduleRef.get(ListItemRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should return paginated list items dto', async () => {
    // Arrange
    const criteria = CriteriaMother.create();
    const query = new SearchListItemsByCriteriaQuery(criteria);

    repository.search.mockResolvedValue(
      PaginatedMother.create([
        ListItemMother.create(),
        ListItemMother.create(),
      ]),
    );

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(repository.search).toHaveBeenCalledWith(criteria);
    expect(result.items).toHaveLength(2);
    expect(result.pagination.total).toBe(2);
  });
});
