import { ListItemMother } from '@lists/__tests__/mothers/list-item.mother';

import { ListItemMapper } from './list-item.mapper';

describe('ListItemMapper', () => {
  it('should map list item to dto', () => {
    // Arrange
    const listItem = ListItemMother.create();

    // Act
    const dto = ListItemMapper.toDto(listItem);

    // Assert
    expect(dto).toEqual({
      id: listItem.id,
      itemId: listItem.itemId,
      quantity: listItem.quantity,
    });
  });

  it('should map list item array to dto array', () => {
    // Arrange
    const listItems = [ListItemMother.create(), ListItemMother.create()];

    // Act
    const dtos = ListItemMapper.toDtoList(listItems);

    // Assert
    expect(dtos).toHaveLength(2);
  });
});
