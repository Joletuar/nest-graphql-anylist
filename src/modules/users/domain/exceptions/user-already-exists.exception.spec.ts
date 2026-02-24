import { DomainException } from '@shared/domain/exceptions/domain.exception';

import { UserAlreadyExistsException } from './user-already-exists.exception';

describe('UserAlreadyExistsException', () => {
  it('should create a domain exception with expected message and details', () => {
    const email = 'john@mail.com';

    const exception = new UserAlreadyExistsException(email);

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.errorObject.message).toContain(email);
    expect(exception.errorObject.details).toHaveLength(1);
    expect(exception.name).toBe('UserAlreadyExistsException');
  });
});
