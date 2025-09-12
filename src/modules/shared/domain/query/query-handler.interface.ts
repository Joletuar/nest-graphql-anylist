import { QueryResponse } from './query-response.interface';
import { Query } from './query.interface';

export interface QueryHandler<
  TQuery extends Query,
  TQueryResponse extends QueryResponse,
> {
  handle(query: TQuery): Promise<TQueryResponse> | TQueryResponse;
}
