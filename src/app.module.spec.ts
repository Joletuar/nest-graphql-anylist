import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './app.module';
import { AuthModule } from './modules/auth/infrastructure/https/nestjs/auth.module';
import { ItemsModule } from './modules/items/infrastructure/http/nestjs/items.module';
import { ListsModule } from './modules/lists/infrastructure/http/nestjs/lists.module';
import { SharedModule } from './modules/shared/infrastructure/http/nestjs/shared.module';
import { UsersModule } from './modules/users/infrastructure/http/nestjs/users.module';

describe('AppModule', () => {
  let moduleRef: TestingModule;
  let sharedModule: SharedModule;
  let itemsModule: ItemsModule;
  let usersModule: UsersModule;
  let authModule: AuthModule;
  let listsModule: ListsModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    sharedModule = moduleRef.get<SharedModule>(SharedModule);
    itemsModule = moduleRef.get<ItemsModule>(ItemsModule);
    usersModule = moduleRef.get<UsersModule>(UsersModule);
    authModule = moduleRef.get<AuthModule>(AuthModule);
    listsModule = moduleRef.get<ListsModule>(ListsModule);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('should be defined all modules', () => {
    expect(sharedModule).toBeDefined();
    expect(itemsModule).toBeDefined();
    expect(usersModule).toBeDefined();
    expect(authModule).toBeDefined();
    expect(listsModule).toBeDefined();
  });
});
