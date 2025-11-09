import { ITokenProvider } from '@/core/domain/repositories/token-provider.interface';
import jwt from 'jsonwebtoken';

/**
 * JWT Token Provider Implementation
 * Implementa a interface ITokenProvider usando jsonwebtoken
 */
export class JWTTokenProvider implements ITokenProvider {
  private readonly secret: string;
  private readonly expiresIn: string | number;

  constructor(secret?: string, expiresIn?: string | number) {
    this.secret = secret || process.env.JWT_SECRET || 'default-secret-key';
    this.expiresIn = expiresIn || '7d';
  }

  sign(payload: Record<string, any>): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as any);
  }

  verify(token: string): Record<string, any> | null {
    try {
      const decoded = jwt.verify(token, this.secret);
      return decoded as Record<string, any>;
    } catch (error) {
      return null;
    }
  }
}
