import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from '@modules/users/domain/user.repository';
import { createMockUserRepository } from '@users/__tests__/mocks/user-repository.mock';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { UserNotFoundException } from '@users/domain/exceptions/user-not-found.exception';
import { ulid } from 'ulidx';

import { UserDto } from '../../user.dto';
import { UserMapper } from '../../user.mapper';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { FindUserByIdQueryHandler } from './find-user-by-id.query-handler';

describe('FindUserByIdQueryHandler', () => {
  let moduleRef: TestingModule;
  let findUserByIdQueryHandler: FindUserByIdQueryHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        FindUserByIdQueryHandler,
        {
          provide: UserRepository,
          useValue: createMockUserRepository(),
        },
      ],
    }).compile();

    findUserByIdQueryHandler = moduleRef.get<FindUserByIdQueryHandler>(
      FindUserByIdQueryHandler,
    );
    userRepository = moduleRef.get(UserRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  it('should be defined', () => {
    expect(findUserByIdQueryHandler).toBeDefined();
  });

  it('should find a user by id and return user dto', async () => {
    // Arrange
    const userId = ulid();
    const query = new FindUserByIdQuery(userId);
    const mockUser = UserMother.create({ id: userId });
    const expectedUserDto: UserDto = UserMapper.toDto(mockUser);
    userRepository.findById.mockResolvedValue(mockUser);

    // Act
    const userDto = await findUserByIdQueryHandler.execute(query);

    // Assert
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userDto).toBeDefined();
    expect(userDto).toEqual(expectedUserDto);
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    // Arrange
    const userId = ulid();
    const query = new FindUserByIdQuery(userId);
    userRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(findUserByIdQueryHandler.execute(query)).rejects.toThrow(
      UserNotFoundException,
    );
  });
});
