export interface ErrorObject {
  readonly message: string;

  readonly details: Detail[];
}

interface Detail {
  cause: string;
}
