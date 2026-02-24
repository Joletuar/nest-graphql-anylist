import { ListRespository } from '@lists/domain/list.repository';

export const createMockListRepository = (): jest.Mocked<ListRespository> => ({
  create: jest.fn(),
  update: jest.fn(),
  getAll: jest.fn(),
  findById: jest.fn(),
});
