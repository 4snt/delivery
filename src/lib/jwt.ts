import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_insecure_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayloadCliente {
  email: string;
  nome?: string;
}

export function signClienteToken(payload: JwtPayloadCliente): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyClienteToken(token: string): JwtPayloadCliente | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayloadCliente;
  } catch {
    return null;
  }
}


