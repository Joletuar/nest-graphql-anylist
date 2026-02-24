import { UserRepository } from '@users/domain/user.repository';

export const createMockUserRepository = (): jest.Mocked<UserRepository> => ({
  create: jest.fn(),
  update: jest.fn(),
  getAll: jest.fn(),
  findById: jest.fn(),
  search: jest.fn(),
});
