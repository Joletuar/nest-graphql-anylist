import { Test, TestingModule } from '@nestjs/testing';

import { createMockListRepository } from '@lists/__tests__/mocks/list-repository.mock';
import { ListMother } from '@lists/__tests__/mothers/list.mother';
import { FindListByIdService } from '@lists/application/services/find-list-by-id.service';
import { ListRespository } from '@lists/domain/list.repository';

import { GetAllListsQueryHandler } from './get-all-lists.query-handler';

describe('GetAllListsQueryHandler', () => {
  let moduleRef: TestingModule;
  let handler: GetAllListsQueryHandler;
  let repository: jest.Mocked<ListRespository>;
  let findListByIdService: jest.Mocked<FindListByIdService>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        GetAllListsQueryHandler,
        { provide: ListRespository, useValue: createMockListRepository() },
        {
          provide: FindListByIdService,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(GetAllListsQueryHandler);
    repository = moduleRef.get(ListRespository);
    findListByIdService = moduleRef.get(FindListByIdService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should return all lists using find service', async () => {
    // Arrange
    const list1 = ListMother.create();
    const list2 = ListMother.create();

    repository.getAll.mockResolvedValue([list1, list2]);
    findListByIdService.find.mockImplementation(async (id) => ({
      id,
      name: id === list1.id ? list1.name : list2.name,
      userId: id === list1.id ? list1.userId : list2.userId,
    }));

    // Act
    const result = await handler.execute();

    // Assert
    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(findListByIdService.find).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no lists exist', async () => {
    // Arrange
    repository.getAll.mockResolvedValue([]);

    // Act
    const result = await handler.execute();

    // Assert
    expect(result).toEqual([]);
    expect(findListByIdService.find).not.toHaveBeenCalled();
  });
});
