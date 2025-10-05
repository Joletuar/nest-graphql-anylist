import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class ItemNotFoundException extends DomainException {
  constructor(id: string) {
    super({
      message: `Item <${id}> not found.`,
      details: [
        {
          cause: `No item exists with the provided id: ${id}.`,
        },
      ],
    });

    this.name = this.constructor.name;
  }
}
