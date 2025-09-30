import { User } from 'src/modules/users/domain/user.entity';

export interface UserTokenPayload {
  email: string;
  iat?: number;
  exp?: number;
}

export abstract class AuthenticationService {
  abstract validateToken(token: string): Promise<User>;

  abstract validateUserFromPayload(payload: UserTokenPayload): Promise<User>;
}
