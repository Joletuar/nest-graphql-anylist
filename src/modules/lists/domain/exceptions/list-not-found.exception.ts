import { DomainException } from 'src/modules/shared/domain/exceptions/domain.exception';

export class ListNotFoundException extends DomainException {
  constructor(id: string) {
    super({
      message: `List not found`,
      details: [
        {
          cause: `List with id ${id} not found`,
        },
      ],
    });

    this.name = this.constructor.name;
  }
}
