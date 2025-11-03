import { ErrorObject } from '../base.error';
import { DomainException } from './domain.exception';

export class DomainValidationException extends DomainException {
  constructor(details: ErrorObject['details']) {
    super({ message: 'Error in the string validation', details });
  }
}
