import { Test, TestingModule } from '@nestjs/testing';

import { createMockUserRepository } from '@users/__tests__/mocks/user-repository.mock';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { UserNotFoundException } from '@users/domain/exceptions/user-not-found.exception';
import { Role } from '@users/domain/roles.enum';
import { UserRepository } from '@users/domain/user.repository';

import { UpdateUserCommand } from './update-user.command';
import { UpdateUserCommandHanlder } from './update-user.command-handler';

describe('UpdateUserCommandHanlder', () => {
  let moduleRef: TestingModule;
  let handler: UpdateUserCommandHanlder;
  let repository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        UpdateUserCommandHanlder,
        { provide: UserRepository, useValue: createMockUserRepository() },
      ],
    }).compile();

    handler = moduleRef.get(UpdateUserCommandHanlder);
    repository = moduleRef.get(UserRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should update user and keep password unchanged', async () => {
    // Arrange
    const currentUser = UserMother.create({ password: 'old-hash' });
    const command = new UpdateUserCommand(
      currentUser.id,
      'Jane Doe',
      undefined,
      ['guest'],
      false,
    );

    repository.findById.mockResolvedValue(currentUser);
    repository.update.mockImplementation(async (user) => user);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: currentUser.id,
        fullName: 'Jane Doe',
        email: currentUser.email,
        password: 'old-hash',
        roles: [Role.GUEST],
        isActive: false,
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: currentUser.id,
        fullName: 'Jane Doe',
      }),
    );
    expect(result).not.toHaveProperty('password');
  });

  it('should keep current roles when command roles is empty', async () => {
    // Arrange
    const currentUser = UserMother.create({ roles: [Role.ADMIN] });
    const command = new UpdateUserCommand(
      currentUser.id,
      undefined,
      undefined,
      [],
    );

    repository.findById.mockResolvedValue(currentUser);
    repository.update.mockImplementation(async (user) => user);

    // Act
    await handler.execute(command);

    // Assert
    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({ roles: [Role.ADMIN] }),
    );
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    // Arrange
    const command = new UpdateUserCommand('missing-id', 'Jane Doe');
    repository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      UserNotFoundException,
    );
    expect(repository.update).not.toHaveBeenCalled();
  });
});
