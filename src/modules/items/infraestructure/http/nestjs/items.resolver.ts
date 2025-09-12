import { Resolver } from '@nestjs/graphql';

import { ItemSchema } from './item.schema';

@Resolver(() => ItemSchema)
export class ItemsResolver {}
