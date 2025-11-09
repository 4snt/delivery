import { IHashProvider } from '@/core/domain/repositories/hash-provider.interface';
import bcrypt from 'bcryptjs';

/**
 * BCrypt Hash Provider Implementation
 * Implementa a interface IHashProvider usando bcryptjs
 */
export class BCryptHashProvider implements IHashProvider {
  private readonly saltRounds = 10;

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
