import { Test, TestingModule } from '@nestjs/testing';

import { ListMother } from '@lists/__tests__/mothers/list.mother';
import { FindListByIdService } from '@lists/application/services/find-list-by-id.service';

import { FindListByIdQuery } from './find-list-by-id.query';
import { FindListByIdQueryHandler } from './find-list-by-id.query-handler';

describe('FindListByIdQueryHandler', () => {
  let moduleRef: TestingModule;
  let handler: FindListByIdQueryHandler;
  let service: jest.Mocked<FindListByIdService>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        FindListByIdQueryHandler,
        {
          provide: FindListByIdService,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(FindListByIdQueryHandler);
    service = moduleRef.get(FindListByIdService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should delegate find operation to service', async () => {
    // Arrange
    const list = ListMother.create();
    const query = new FindListByIdQuery(list.id);
    service.find.mockResolvedValue({
      id: list.id,
      name: list.name,
      userId: list.userId,
    });

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(service.find).toHaveBeenCalledWith(list.id);
    expect(result.id).toBe(list.id);
  });
});
