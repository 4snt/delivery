/**
 * Base class for application errors
 */
export abstract class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

export class DuplicateError extends AppError {
  constructor(resource: string) {
    super(`${resource} already exists`);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid credentials');
  }
}
