import { DomainException } from '@shared/domain/exceptions/domain.exception';

import { UserNotFoundException } from './user-not-found.exception';

describe('UserNotFoundException', () => {
  it('should create a domain exception with expected message and details', () => {
    const userId = 'user-id';

    const exception = new UserNotFoundException(userId);

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.errorObject.message).toBe('User does not exist');
    expect(exception.errorObject.details[1].cause).toContain(userId);
    expect(exception.name).toBe('UserNotFoundException');
  });
});
