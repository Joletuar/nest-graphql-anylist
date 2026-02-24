import { ListMother } from '@lists/__tests__/mothers/list.mother';

import { ListMapper } from './list.mapper';

describe('ListMapper', () => {
  it('should map list to dto', () => {
    // Arrange
    const list = ListMother.create();

    // Act
    const dto = ListMapper.toDto(list);

    // Assert
    expect(dto).toEqual({
      id: list.id,
      name: list.name,
      userId: list.userId,
    });
  });

  it('should map list array to dto array', () => {
    // Arrange
    const lists = [ListMother.create(), ListMother.create()];

    // Act
    const dtos = ListMapper.toDtoList(lists);

    // Assert
    expect(dtos).toHaveLength(2);
  });
});
