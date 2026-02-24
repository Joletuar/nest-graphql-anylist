import { DomainException } from '@shared/domain/exceptions/domain.exception';

import { ListItemNotFoundException } from './list-item-not-found.exception';

describe('ListItemNotFoundException', () => {
  it('should create a domain exception with expected message and details', () => {
    const id = 'list-item-id';

    const exception = new ListItemNotFoundException(id);

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.errorObject.message).toBe('List item not found');
    expect(exception.errorObject.details[0].cause).toContain(id);
    expect(exception.name).toBe('ListItemNotFoundException');
  });
});
