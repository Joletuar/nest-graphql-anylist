import { QueryHandler } from './query-handler.interface';
import { QueryResponse } from './query-response.interface';
import { Query, QueryClass } from './query.interface';

export interface QueryBus {
  subscribe<TQuery extends Query, TQueryResponse extends QueryResponse>(
    query: QueryClass,
    queryHandler: QueryHandler<TQuery, TQueryResponse>,
  ): Promise<void> | void;

  ask<TQueryResponse extends QueryResponse>(
    query: QueryClass,
  ): Promise<TQueryResponse> | TQueryResponse;
}
