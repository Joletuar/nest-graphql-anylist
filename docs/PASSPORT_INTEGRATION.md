# Passport Integration with Clean Architecture

This implementation integrates Passport.js authentication into the existing NestJS GraphQL application while maintaining clean architecture principles and separation of concerns.

## Architecture Overview

### Domain Layer

- `AuthenticationService` (abstract): Defines the contract for authentication operations
- `UserTokenPayload` interface: Types the JWT payload structure

### Infrastructure Layer

- `NestAuthenticationService`: Concrete implementation of the domain service
- `JwtStrategy`: Passport strategy for JWT validation
- `GqlJwtAuthGuard`: GraphQL-compatible authentication guard
- `CurrentUser` decorator: Extracts authenticated user from GraphQL context

## Key Benefits

✅ **Maintains Clean Architecture**: Domain logic remains separate from infrastructure concerns  
✅ **Backward Compatibility**: Existing `TokenGuard` still works alongside new Passport implementation  
✅ **GraphQL Integration**: Full support for GraphQL queries and mutations  
✅ **Type Safety**: Strong TypeScript typing throughout the authentication flow  
✅ **Extensibility**: Easy to add new authentication strategies (OAuth, SAML, etc.)

## Usage Examples

### Basic Authentication in GraphQL Resolver

```typescript
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { User } from 'src/modules/users/domain/user.entity';

import { CurrentUser } from '../decorators/current-user.decorator';
import { GqlJwtAuthGuard } from '../guards/gql-jwt-auth.guard';

@Resolver()
export class UserResolver {
  @Query(() => User)
  @UseGuards(GqlJwtAuthGuard)
  me(@CurrentUser() user: User): User {
    return user;
  }
}
```

### Migration from Existing TokenGuard

**Before (with custom TokenGuard):**

```typescript
@UseGuards(TokenGuard)
async getMyProfile(@CurrentUser() user: User) {
  return user;
}
```

**After (with Passport):**

```typescript
@UseGuards(GqlJwtAuthGuard)
getMyProfile(@CurrentUser() user: User) {
  return user;
}
```

## File Structure

```
src/modules/auth/
├── domain/
│   └── authentication.service.ts           # Domain contract
├── application/
│   ├── sign-in/                           # Existing use cases
│   └── sign-up/
└── infraestructure/
    ├── authentication/
    │   ├── nestjs/
    │   │   └── nest-authentication.service.ts  # Domain implementation
    │   └── passport/
    │       ├── strategies/
    │       │   └── jwt.strategy.ts         # Passport JWT strategy
    │       └── guards/
    │           └── gql-jwt-auth.guard.ts   # GraphQL guard
    └── https/
        └── nestjs/
            ├── decorators/
            │   └── current-user.decorator.ts   # User extraction
            ├── guards/
            │   └── token.guard.ts          # Existing guard (kept)
            └── auth.module.ts              # Updated module
```

## Implementation Details

### Authentication Flow

1. **Request arrives** with `Authorization: Bearer <token>` header
2. **GqlJwtAuthGuard** activates and delegates to Passport
3. **JwtStrategy** validates token using `AuthenticationService`
4. **AuthenticationService** validates user exists and is active
5. **User object** is attached to request context
6. **@CurrentUser()** decorator extracts user from context

### Clean Architecture Compliance

- **Domain Layer**: Contains business rules and contracts (`AuthenticationService`)
- **Application Layer**: Use cases remain unchanged (`SignIn`, `SignUp`)
- **Infrastructure Layer**: Passport implementation respects domain contracts
- **Presentation Layer**: GraphQL resolvers use clean decorators and guards

## Adding New Authentication Strategies

To add OAuth2 authentication (e.g., Google):

1. **Install dependencies**:

   ```bash
   pnpm add passport-google-oauth20 @types/passport-google-oauth20
   ```

2. **Create strategy**:

   ```typescript
   @Injectable()
   export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
     constructor(private authService: AuthenticationService) {
       super({
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: '/auth/google/callback',
         scope: ['email', 'profile'],
       });
     }

     async validate(accessToken: string, refreshToken: string, profile: any) {
       return this.authService.validateGoogleUser(profile);
     }
   }
   ```

3. **Register in module**:
   ```typescript
   providers: [
     JwtStrategy,
     GoogleStrategy, // Add new strategy
     // ... other providers
   ];
   ```

## Benefits Over Custom Implementation

| Aspect              | Custom TokenGuard     | Passport Implementation  |
| ------------------- | --------------------- | ------------------------ |
| Code Complexity     | High maintenance      | Industry standard        |
| Multiple Auth Types | Manual implementation | Built-in support         |
| Testing             | Complex mocking       | Established patterns     |
| Documentation       | Custom docs needed    | Extensive community docs |
| Security            | Custom validation     | Battle-tested            |
| Extensibility       | Difficult             | Plugin-based             |

## Migration Strategy

The implementation allows for **gradual migration**:

1. **Phase 1**: Both guards coexist (current state)
2. **Phase 2**: Replace `@UseGuards(TokenGuard)` with `@UseGuards(GqlJwtAuthGuard)` incrementally
3. **Phase 3**: Remove old `TokenGuard` when no longer used

This ensures zero downtime and allows for thorough testing of the new implementation.
