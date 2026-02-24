import { Test, TestingModule } from '@nestjs/testing';

import { createMockItemRepository } from '@items/__tests__/mocks/item-repository.mock';
import { ItemMother } from '@items/__tests__/mothers/item.mother';
import { ItemRepository } from '@items/domain/item.repository';
import { createMockListRepository } from '@lists/__tests__/mocks/list-repository.mock';
import { ListItemMother } from '@lists/__tests__/mothers/list-item.mother';
import { ListMother } from '@lists/__tests__/mothers/list.mother';
import { ItemNotFoundException } from '@lists/domain/exceptions/item-not-found.exception';
import { ListNotFoundException } from '@lists/domain/exceptions/list-not-found.exception';
import { ListRespository } from '@lists/domain/list.repository';

import { FindListByIdService } from './find-list-by-id.service';

describe('FindListByIdService', () => {
  let moduleRef: TestingModule;
  let service: FindListByIdService;
  let listRepository: jest.Mocked<ListRespository>;
  let itemRepository: jest.Mocked<ItemRepository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        FindListByIdService,
        { provide: ListRespository, useValue: createMockListRepository() },
        { provide: ItemRepository, useValue: createMockItemRepository() },
      ],
    }).compile();

    service = moduleRef.get(FindListByIdService);
    listRepository = moduleRef.get(ListRespository);
    itemRepository = moduleRef.get(ItemRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should return list dto when list and items exist', async () => {
    // Arrange
    const item = ItemMother.create();
    const list = ListMother.create({
      items: [ListItemMother.create({ itemId: item.id, quantity: 1 })],
    });

    listRepository.findById.mockResolvedValue(list);
    itemRepository.findById.mockResolvedValue(item);

    // Act
    const result = await service.find(list.id);

    // Assert
    expect(listRepository.findById).toHaveBeenCalledWith(list.id);
    expect(itemRepository.findById).toHaveBeenCalledWith(item.id);
    expect(result).toEqual(
      expect.objectContaining({
        id: list.id,
        name: list.name,
        userId: list.userId,
      }),
    );
  });

  it('should throw ListNotFoundException when list does not exist', async () => {
    // Arrange
    listRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(service.find('missing-list-id')).rejects.toThrow(
      ListNotFoundException,
    );
  });

  it('should throw ItemNotFoundException when item does not exist', async () => {
    // Arrange
    const list = ListMother.create({
      items: [
        ListItemMother.create({ itemId: 'missing-item-id', quantity: 1 }),
      ],
    });
    listRepository.findById.mockResolvedValue(list);
    itemRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(service.find(list.id)).rejects.toThrow(ItemNotFoundException);
  });
});
