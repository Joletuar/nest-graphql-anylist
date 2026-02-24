import { Test, TestingModule } from '@nestjs/testing';

import { createMockUserRepository } from '@users/__tests__/mocks/user-repository.mock';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { UserRepository } from '@users/domain/user.repository';

import { GetAllUsersQueryHandler } from './get-all-user.query-handler';

describe('GetAllUsersQueryHandler', () => {
  let moduleRef: TestingModule;
  let handler: GetAllUsersQueryHandler;
  let repository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        GetAllUsersQueryHandler,
        { provide: UserRepository, useValue: createMockUserRepository() },
      ],
    }).compile();

    handler = moduleRef.get(GetAllUsersQueryHandler);
    repository = moduleRef.get(UserRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should return all users', async () => {
    // Arrange
    const users = [UserMother.create(), UserMother.create()];
    repository.getAll.mockResolvedValue(users);

    // Act
    const result = await handler.execute();

    // Assert
    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('password');
  });

  it('should return empty array when no users exist', async () => {
    // Arrange
    repository.getAll.mockResolvedValue([]);

    // Act
    const result = await handler.execute();

    // Assert
    expect(result).toEqual([]);
  });
});
