import { DomainException } from '@shared/domain/exceptions/domain.exception';

import { ItemNotFoundException } from './item-not-found.exception';

describe('ItemNotFoundException', () => {
  it('should create a domain exception with expected message and details', () => {
    const itemId = 'item-id';

    const exception = new ItemNotFoundException(itemId);

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.errorObject.message).toBe('Item does not exist');
    expect(exception.errorObject.details[1].cause).toContain(itemId);
    expect(exception.name).toBe('ItemNotFoundException');
  });
});
