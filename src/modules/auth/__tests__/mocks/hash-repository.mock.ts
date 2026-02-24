import { HashRepository } from '@auth/domain/hash.repository';

export const createMockHashRepository = (): jest.Mocked<HashRepository> => ({
  hash: jest.fn(),
  validate: jest.fn(),
});
