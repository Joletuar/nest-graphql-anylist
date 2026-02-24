import { TokenRepository } from '@auth/domain/token.repository';

export const createMockTokenRepository = (): jest.Mocked<TokenRepository> => ({
  generate: jest.fn(),
  validate: jest.fn(),
});
