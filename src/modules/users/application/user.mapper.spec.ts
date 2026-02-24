import { PaginatedMother } from '@shared/__tests__/mothers/paginated.mother';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { Role } from '@users/domain/roles.enum';

import { UserMapper } from './user.mapper';

describe('UserMapper', () => {
  it('should map user to dto', () => {
    // Arrange
    const user = UserMother.create({ roles: [Role.ADMIN, Role.GUEST] });

    // Act
    const dto = UserMapper.toDto(user);

    // Assert
    expect(dto.roles).toEqual(['admin', 'guest']);
    expect(dto.password).toBe(user.password);
  });

  it('should map users to dto list', () => {
    // Arrange
    const users = [UserMother.create(), UserMother.create()];

    // Act
    const dtos = UserMapper.toDtoList(users);

    // Assert
    expect(dtos).toHaveLength(2);
  });

  it('should map paginated users to paginated dto', () => {
    // Arrange
    const paginated = PaginatedMother.create([UserMother.create()]);

    // Act
    const dto = UserMapper.toPaginatedDto(paginated);

    // Assert
    expect(dto.users).toHaveLength(1);
    expect(dto.pagination.total).toBe(1);
  });

  it('should map user to dto without password', () => {
    // Arrange
    const user = UserMother.create();

    // Act
    const dto = UserMapper.toDtoWithoutPassword(user);

    // Assert
    expect(dto).not.toHaveProperty('password');
    expect(dto.id).toBe(user.id);
  });

  it('should map user list to dto list without password', () => {
    // Arrange
    const users = [UserMother.create(), UserMother.create()];

    // Act
    const dtos = UserMapper.toDtoListWithoutPassword(users);

    // Assert
    expect(dtos).toHaveLength(2);
    expect(dtos[0]).not.toHaveProperty('password');
  });

  it('should map paginated users to paginated dto without password', () => {
    // Arrange
    const paginated = PaginatedMother.create([UserMother.create()]);

    // Act
    const dto = UserMapper.toPaginatedDtoWithoutPassword(paginated);

    // Assert
    expect(dto.users[0]).not.toHaveProperty('password');
    expect(dto.pagination.total).toBe(1);
  });
});
