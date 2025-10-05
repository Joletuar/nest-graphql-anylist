import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class ItemNotFoundException extends DomainException {
  constructor(itemId: string) {
    super({
      message: `Item does not exist`,
      details: [
        {
          cause: 'There is not item associated with the given id',
        },
        {
          cause: `The item ${itemId} was not found in the system`,
        },
      ],
    });

    this.name = this.constructor.name;
  }
}
