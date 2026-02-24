import { ItemMother } from '@items/__tests__/mothers/item.mother';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { UserMapper } from '@users/application/user.mapper';

import { ItemMapper } from './item.mapper';

describe('ItemMapper', () => {
  it('should map item to dto', () => {
    // Arrange
    const item = ItemMother.create();

    // Act
    const dto = ItemMapper.toDto(item);

    // Assert
    expect(dto).toEqual({
      id: item.id,
      name: item.name,
      stock: item.stock,
      quantityUnits: item.quantityUnits,
      userId: item.userId,
    });
  });

  it('should map list of items to dto list', () => {
    // Arrange
    const items = [ItemMother.create(), ItemMother.create()];

    // Act
    const dtos = ItemMapper.toDtoList(items);

    // Assert
    expect(dtos).toHaveLength(2);
    expect(dtos[0].id).toBe(items[0].id);
  });

  it('should map item and user to query dto', () => {
    // Arrange
    const user = UserMapper.toDto(UserMother.create());
    const item = ItemMother.create({ userId: user.id });

    // Act
    const dto = ItemMapper.toQueryDto(item, user);

    // Assert
    expect(dto).toEqual(
      expect.objectContaining({
        id: item.id,
        name: item.name,
        stock: item.stock,
        quantityUnits: item.quantityUnits,
        user: expect.objectContaining({ id: user.id, email: user.email }),
      }),
    );
  });

  it('should throw error when a user is missing while mapping query dto list', () => {
    // Arrange
    const item = ItemMother.create();

    // Act & Assert
    expect(() => ItemMapper.toQueryDtoList([item], [])).toThrow(
      `User with ID ${item.userId} not found`,
    );
  });
});
