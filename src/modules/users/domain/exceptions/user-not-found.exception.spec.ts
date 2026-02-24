import { DomainException } from '@shared/domain/exceptions/domain.exception';

import { UserNotFoundException } from './user-not-found.exception';

describe('UserNotFoundException', () => {
  it('should create a domain exception with expected message and details', () => {
    const id = 'user-id';

    const exception = new UserNotFoundException(id);

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.errorObject.message).toContain(id);
    expect(exception.errorObject.details[0].cause).toContain(id);
    expect(exception.name).toBe('UserNotFoundException');
  });
});
