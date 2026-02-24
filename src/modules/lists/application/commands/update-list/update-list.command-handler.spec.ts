import { Test, TestingModule } from '@nestjs/testing';

import { createMockItemRepository } from '@items/__tests__/mocks/item-repository.mock';
import { ItemMother } from '@items/__tests__/mothers/item.mother';
import { ItemRepository } from '@items/domain/item.repository';
import { createMockListRepository } from '@lists/__tests__/mocks/list-repository.mock';
import { ListItemMother } from '@lists/__tests__/mothers/list-item.mother';
import { ListMother } from '@lists/__tests__/mothers/list.mother';
import { ItemNotFoundException } from '@lists/domain/exceptions/item-not-found.exception';
import { ListNotFoundException } from '@lists/domain/exceptions/list-not-found.exception';
import { UserNotFoundException } from '@lists/domain/exceptions/user-not-found.exception';
import { ListRespository } from '@lists/domain/list.repository';
import { createMockUserRepository } from '@users/__tests__/mocks/user-repository.mock';
import { UserMother } from '@users/__tests__/mothers/user.mother';
import { UserRepository } from '@users/domain/user.repository';
import { ulid } from 'ulidx';

import { UpdateListCommand } from './update-list.command';
import { UpdateListCommandHandler } from './update-list.command-handler';

describe('UpdateListCommandHandler', () => {
  let moduleRef: TestingModule;
  let handler: UpdateListCommandHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let itemRepository: jest.Mocked<ItemRepository>;
  let listRepository: jest.Mocked<ListRespository>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        UpdateListCommandHandler,
        { provide: UserRepository, useValue: createMockUserRepository() },
        { provide: ItemRepository, useValue: createMockItemRepository() },
        { provide: ListRespository, useValue: createMockListRepository() },
      ],
    }).compile();

    handler = moduleRef.get(UpdateListCommandHandler);
    userRepository = moduleRef.get(UserRepository);
    itemRepository = moduleRef.get(ItemRepository);
    listRepository = moduleRef.get(ListRespository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should update list with name user and items', async () => {
    // Arrange
    const user = UserMother.create();
    const item = ItemMother.create();
    const list = ListMother.create({ items: [] });

    const command = new UpdateListCommand(list.id, 'Updated name', user.id, [
      { id: ulid(), itemId: item.id, quantity: 5 },
    ]);

    listRepository.findById.mockResolvedValue(list);
    userRepository.findById.mockResolvedValue(user);
    itemRepository.findById.mockResolvedValue(item);
    listRepository.update.mockImplementation(async (input) => input);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result.name).toBe('Updated name');
    expect(result.userId).toBe(user.id);
    expect(listRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should throw ListNotFoundException when list does not exist', async () => {
    // Arrange
    const command = new UpdateListCommand('missing-list-id', 'Updated name');
    listRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      ListNotFoundException,
    );
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    // Arrange
    const list = ListMother.create();
    const command = new UpdateListCommand(
      list.id,
      undefined,
      'missing-user-id',
    );

    listRepository.findById.mockResolvedValue(list);
    userRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      UserNotFoundException,
    );
  });

  it('should throw ItemNotFoundException when list item does not exist', async () => {
    // Arrange
    const list = ListMother.create();
    const command = new UpdateListCommand(list.id, undefined, undefined, [
      { id: ulid(), itemId: 'missing-item-id', quantity: 1 },
    ]);

    listRepository.findById.mockResolvedValue(list);
    itemRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      ItemNotFoundException,
    );
  });
});
