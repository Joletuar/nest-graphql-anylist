export interface UpdateItemDto {
  readonly id: string;
  readonly name?: string;
  readonly stock?: number;
  readonly quantityUnits?: string;
  readonly userId?: string;
}
