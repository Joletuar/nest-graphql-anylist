import { Test, TestingModule } from '@nestjs/testing';

import { createMockHashRepository } from '@auth/__tests__/mocks/hash-repository.mock';
import { createMockTokenRepository } from '@auth/__tests__/mocks/token-repository.mock';
import { InvalidCredentialsException } from '@auth/domain/exceptions/invalid-credentials.exception';
import { HashRepository } from '@auth/domain/hash.repository';
import { TokenRepository } from '@auth/domain/token.repository';
import { PaginatedMother } from '@shared/__tests__/mothers/paginated.mother';
import { createMockUserRepository } from '@users/__tests__/mocks/user-repository.mock';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { UserRepository } from '@users/domain/user.repository';

import { SignIn } from './sign-in.use-case';

describe('SignIn', () => {
  let moduleRef: TestingModule;
  let signIn: SignIn;
  let userRepository: jest.Mocked<UserRepository>;
  let hashRepository: jest.Mocked<HashRepository>;
  let tokenRepository: jest.Mocked<TokenRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        SignIn,
        { provide: UserRepository, useValue: createMockUserRepository() },
        { provide: HashRepository, useValue: createMockHashRepository() },
        { provide: TokenRepository, useValue: createMockTokenRepository() },
      ],
    }).compile();

    signIn = moduleRef.get(SignIn);
    userRepository = moduleRef.get(UserRepository);
    hashRepository = moduleRef.get(HashRepository);
    tokenRepository = moduleRef.get(TokenRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(signIn).toBeDefined();
  });

  it('should sign in and return token', async () => {
    // Arrange
    const user = UserMother.create({
      email: 'john@mail.com',
      password: 'hashed-password',
    });
    const dto = { email: 'john@mail.com', password: 'plain-password' };

    userRepository.search.mockResolvedValue(PaginatedMother.create([user]));
    hashRepository.validate.mockResolvedValue(true);
    tokenRepository.generate.mockResolvedValue('jwt-token');

    // Act
    const token = await signIn.execute(dto);

    // Assert
    expect(userRepository.search).toHaveBeenCalledTimes(2);
    expect(hashRepository.validate).toHaveBeenCalledWith(
      'hashed-password',
      'plain-password',
    );
    expect(tokenRepository.generate).toHaveBeenCalledWith({
      email: 'john@mail.com',
    });
    expect(token).toBe('jwt-token');
  });

  it('should throw InvalidCredentialsException when user does not exist', async () => {
    // Arrange
    const dto = { email: 'missing@mail.com', password: 'plain-password' };
    userRepository.search.mockResolvedValue(PaginatedMother.create([]));

    // Act & Assert
    await expect(signIn.execute(dto)).rejects.toThrow(
      InvalidCredentialsException,
    );
    expect(hashRepository.validate).not.toHaveBeenCalled();
    expect(tokenRepository.generate).not.toHaveBeenCalled();
  });

  it('should throw InvalidCredentialsException when password is invalid', async () => {
    // Arrange
    const user = UserMother.create({
      email: 'john@mail.com',
      password: 'hashed-password',
    });
    const dto = { email: 'john@mail.com', password: 'wrong-password' };

    userRepository.search.mockResolvedValue(PaginatedMother.create([user]));
    hashRepository.validate.mockResolvedValue(false);

    // Act & Assert
    await expect(signIn.execute(dto)).rejects.toThrow(
      InvalidCredentialsException,
    );
    expect(tokenRepository.generate).not.toHaveBeenCalled();
  });
});
