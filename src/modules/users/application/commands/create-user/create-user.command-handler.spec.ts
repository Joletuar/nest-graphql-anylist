import { Test, TestingModule } from '@nestjs/testing';

import { CriteriaMother } from '@shared/__tests__/mothers/criteria.mother';
import { PaginatedMother } from '@shared/__tests__/mothers/paginated.mother';
import { createMockUserRepository } from '@users/__tests__/mocks/user-repository.mock';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { UserAlreadyExistsException } from '@users/domain/exceptions/user-already-exists.exception';
import { Role } from '@users/domain/roles.enum';
import { UserRepository } from '@users/domain/user.repository';

import { CreateUserCommand } from './create-user.command';
import { CreateUserCommandHandler } from './create-user.command-handler';

describe('CreateUserCommandHandler', () => {
  let moduleRef: TestingModule;
  let handler: CreateUserCommandHandler;
  let repository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserCommandHandler,
        { provide: UserRepository, useValue: createMockUserRepository() },
      ],
    }).compile();

    handler = moduleRef.get(CreateUserCommandHandler);
    repository = moduleRef.get(UserRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should create user and return dto without password', async () => {
    // Arrange
    const command = new CreateUserCommand(
      'John Doe',
      'john@mail.com',
      'hashed-password',
      [Role.ADMIN],
      true,
    );

    const createdUser = UserMother.create({
      fullName: command.fullName,
      email: command.email,
      password: command.password,
      roles: command.roles,
      isActive: command.isActive,
    });

    repository.search.mockResolvedValue(PaginatedMother.create([]));
    repository.create.mockResolvedValue(createdUser);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(repository.search).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(
      expect.objectContaining({
        id: createdUser.id,
        fullName: createdUser.fullName,
        email: createdUser.email,
        roles: ['admin'],
        isActive: true,
      }),
    );
    expect(result).not.toHaveProperty('password');
  });

  it('should throw UserAlreadyExistsException when user exists', async () => {
    // Arrange
    const existingUser = UserMother.create({ email: 'existing@mail.com' });
    const command = new CreateUserCommand(
      'John Doe',
      'existing@mail.com',
      'hashed-password',
      [Role.ADMIN],
      true,
    );

    repository.search.mockResolvedValue(PaginatedMother.create([existingUser]));

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      UserAlreadyExistsException,
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should search user by email before creating', async () => {
    // Arrange
    const command = new CreateUserCommand(
      'John Doe',
      'john@mail.com',
      'hashed-password',
      [Role.GUEST],
      true,
    );
    repository.search.mockResolvedValue(PaginatedMother.create([]));
    repository.create.mockResolvedValue(
      UserMother.create({
        fullName: command.fullName,
        email: command.email,
        password: command.password,
        roles: command.roles,
      }),
    );

    // Act
    await handler.execute(command);

    // Assert
    expect(repository.search).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: expect.arrayContaining([
          expect.objectContaining({ field: 'email', value: 'john@mail.com' }),
        ]),
      }),
    );
    expect(CriteriaMother.withEmailFilter('john@mail.com').pagination).toEqual({
      page: 1,
      perPage: 1,
    });
  });
});
