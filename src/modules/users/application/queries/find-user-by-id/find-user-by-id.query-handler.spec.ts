/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { Role } from '@modules/users/domain/roles.enum';
import { User } from '@modules/users/domain/user.entity';
import { UserRepository } from '@modules/users/domain/user.repository';
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
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            getAll: jest.fn(),
            findById: jest.fn(),
            search: jest.fn(),
          },
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
    const mockUser: User = {
      id: userId,
      fullName: 'Johan Tuarez',
      email: 'johan_tuarez@hotmail.com',
      isActive: true,
      password: '12345',
      roles: [Role.ADMIN],
    };
    const expectedUserDto: UserDto = UserMapper.toDto(mockUser);
    userRepository.findById.mockResolvedValue(mockUser);

    // Act
    const userDto = await findUserByIdQueryHandler.execute(query);

    // Assert
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userDto).toBeDefined();
    expect(userDto).toEqual(expectedUserDto);
  });
});
