import { DomainException } from '@shared/domain/exceptions/domain.exception';

import { ItemNotFoundException } from './item-not-found.exception';

describe('ItemNotFoundException', () => {
  it('should create a domain exception with expected message and details', () => {
    const id = 'item-id';

    const exception = new ItemNotFoundException(id);

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.errorObject.message).toContain(id);
    expect(exception.errorObject.details[0].cause).toContain(id);
    expect(exception.name).toBe('ItemNotFoundException');
  });
});
