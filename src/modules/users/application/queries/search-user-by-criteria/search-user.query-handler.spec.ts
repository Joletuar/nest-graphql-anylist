import { Test, TestingModule } from '@nestjs/testing';

import { CriteriaMother } from '@shared/__tests__/mothers/criteria.mother';
import { PaginatedMother } from '@shared/__tests__/mothers/paginated.mother';
import { createMockUserRepository } from '@users/__tests__/mocks/user-repository.mock';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { UserRepository } from '@users/domain/user.repository';

import { SearchUserByCriteriaQuery } from './search-user-by-criteria.query';
import { SearchUserByCriteriaQueryHandler } from './search-user.query-handler';

describe('SearchUserByCriteriaQueryHandler', () => {
  let moduleRef: TestingModule;
  let handler: SearchUserByCriteriaQueryHandler;
  let repository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        SearchUserByCriteriaQueryHandler,
        { provide: UserRepository, useValue: createMockUserRepository() },
      ],
    }).compile();

    handler = moduleRef.get(SearchUserByCriteriaQueryHandler);
    repository = moduleRef.get(UserRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should return paginated users dto', async () => {
    // Arrange
    const criteria = CriteriaMother.create();
    const query = new SearchUserByCriteriaQuery(criteria);
    repository.search.mockResolvedValue(
      PaginatedMother.create([UserMother.create(), UserMother.create()]),
    );

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(repository.search).toHaveBeenCalledWith(criteria);
    expect(result.users).toHaveLength(2);
    expect(result.pagination.total).toBe(2);
  });
});
