import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createMockHashRepository } from '@auth/__tests__/mocks/hash-repository.mock';
import { createMockTokenRepository } from '@auth/__tests__/mocks/token-repository.mock';
import { HashRepository } from '@auth/domain/hash.repository';
import { TokenRepository } from '@auth/domain/token.repository';
import { Role } from '@users/domain/roles.enum';

import { SignUpDto } from './sign-up.dto';
import { SignUp } from './sign-up.use-case';

describe('SignUp', () => {
  let moduleRef: TestingModule;
  let signUp: SignUp;
  let commandBus: jest.Mocked<CommandBus>;
  let hashRepository: jest.Mocked<HashRepository>;
  let tokenRepository: jest.Mocked<TokenRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        SignUp,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        { provide: HashRepository, useValue: createMockHashRepository() },
        { provide: TokenRepository, useValue: createMockTokenRepository() },
      ],
    }).compile();

    signUp = moduleRef.get(SignUp);
    commandBus = moduleRef.get(CommandBus);
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
    expect(signUp).toBeDefined();
  });

  it('should create user and return token', async () => {
    // Arrange
    const dto = {
      fullName: 'John Doe',
      email: 'john@mail.com',
      password: 'plain-password',
      roles: [Role.ADMIN],
    };

    hashRepository.hash.mockResolvedValue('hashed-password');
    commandBus.execute.mockResolvedValue({
      id: 'user-id',
      fullName: dto.fullName,
      email: dto.email,
      isActive: true,
      roles: ['admin'],
    });
    tokenRepository.generate.mockResolvedValue('jwt-token');

    // Act
    const token = await signUp.execute(dto);

    // Assert
    expect(hashRepository.hash).toHaveBeenCalledWith('plain-password');
    expect(commandBus.execute).toHaveBeenCalledTimes(1);
    expect(tokenRepository.generate).toHaveBeenCalledWith({
      email: 'john@mail.com',
    });
    expect(token).toBe('jwt-token');
  });

  it('should pass hashed password to create user command', async () => {
    // Arrange
    const dto: SignUpDto = {
      fullName: 'John Doe',
      email: 'john@mail.com',
      password: 'plain-password',
      roles: [Role.GUEST],
    };

    const hashedPass = 'hashed-password';
    hashRepository.hash.mockResolvedValue(hashedPass);
    commandBus.execute.mockResolvedValue({
      id: 'user-id',
      fullName: dto.fullName,
      email: dto.email,
      isActive: true,
      roles: ['guest'],
    });
    tokenRepository.generate.mockResolvedValue('jwt-token');

    // Act
    await signUp.execute(dto);

    // Assert
    const [commandArg] = commandBus.execute.mock.calls[0];
    expect(commandArg).toMatchObject({ ...dto, password: hashedPass });
  });
});
