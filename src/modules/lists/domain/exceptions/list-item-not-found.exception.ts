import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class ListItemNotFoundException extends DomainException {
  constructor(id: string) {
    super({
      message: 'List item not found',
      details: [
        {
          cause: `List item with id ${id} not found`,
        },
      ],
    });

    this.name = this.constructor.name;
  }
}
