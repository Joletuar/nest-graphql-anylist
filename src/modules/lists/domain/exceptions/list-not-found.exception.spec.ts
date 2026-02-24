import { DomainException } from '@shared/domain/exceptions/domain.exception';

import { ListNotFoundException } from './list-not-found.exception';

describe('ListNotFoundException', () => {
  it('should create a domain exception with expected message and details', () => {
    const id = 'list-id';

    const exception = new ListNotFoundException(id);

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.errorObject.message).toBe('List not found');
    expect(exception.errorObject.details[0].cause).toContain(id);
    expect(exception.name).toBe('ListNotFoundException');
  });
});
