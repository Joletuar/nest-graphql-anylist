import { ListItemRepository } from '@lists/domain/list-item.repository';

export const createMockListItemRepository =
  (): jest.Mocked<ListItemRepository> => ({
    search: jest.fn(),
  });
