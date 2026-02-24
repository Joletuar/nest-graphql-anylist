import { AppModule } from './app.module';
import { AuthModule } from './modules/auth/infrastructure/https/nestjs/auth.module';
import { ItemsModule } from './modules/items/infrastructure/http/nestjs/items.module';
import { ListsModule } from './modules/lists/infrastructure/http/nestjs/lists.module';
import { SharedModule } from './modules/shared/infrastructure/http/nestjs/shared.module';
import { UsersModule } from './modules/users/infrastructure/http/nestjs/users.module';

describe('AppModule', () => {
  it('should be defined all modules', () => {
    const imports = Reflect.getMetadata('imports', AppModule) as unknown[];

    expect(imports).toBeDefined();
    expect(imports).toEqual(
      expect.arrayContaining([
        SharedModule,
        ItemsModule,
        UsersModule,
        AuthModule,
        ListsModule,
      ]),
    );
  });
});
