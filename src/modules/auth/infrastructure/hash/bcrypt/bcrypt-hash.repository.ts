import { Injectable } from '@nestjs/common';

import { HashRepository } from '@auth/domain/hash.repository';
import { InfraestructureException } from '@shared/domain/exceptions/infraestructure.exception';
import * as bcrypt from 'bcrypt';

import { BcryptException } from './exceptions/bcrypt.exception';

@Injectable()
export class BcryptHashRepository implements HashRepository {
  private readonly SALT_ROUNDS = 10;

  async hash(value: string): Promise<string> {
    try {
      const hashedValue = await bcrypt.hash(value, this.SALT_ROUNDS);

      return hashedValue;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async validate(hashedValue: string, originalValue: string): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(originalValue, hashedValue);

      return isValid;
    } catch (error) {
      this.handlerError(error);
    }
  }

  private handlerError(error: unknown): never {
    if (error instanceof InfraestructureException) throw error;

    throw new BcryptException(error);
  }
}
