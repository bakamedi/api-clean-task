import { HttpStatus } from '@nestjs/common';

export abstract class CustomError extends Error {
  readonly _tag: string; // Identificador único para cada tipo de error
  status: number;

  constructor(
    public message: string,
    status: number = HttpStatus.BAD_REQUEST,
    public cause?: string,
  ) {
    super(message, { cause });
    this.status = status;
    this.name = this.constructor.name; // Usa el nombre de la clase hija
  }
}

/**MissingParameterError
 * Missing required parametersd
 */
class MissingParameterError extends CustomError {
  readonly _tag = 'MissingParameterError';
  status: number;

  constructor(
    public message: string,
    status: number = 401,
    cause?: string,
  ) {
    super(message, status, cause);
    this.cause = cause;
    this.status = status;
    this.name = this._tag;
  }
}

/**AuthenticationError
 * Authenticated User not found
 */
class AuthenticationError extends CustomError {
  readonly _tag = 'AuthenticationError';
  status: number;

  constructor(
    public message: string,
    status: number = 401,
    cause?: string,
  ) {
    super(message, status, cause);
    this.cause = cause;
    this.status = status;
    this.name = this._tag;
  }
}

/**AuthorizationError
 * Authorization not granted
 */
class AuthorizationError extends CustomError {
  readonly _tag = 'AuthorizationError';
  status: number;

  constructor(
    public message: string = 'You do not have permission to perform this action',
    status: number = 403,
    cause?: string,
  ) {
    super(message, status, cause);
    this.name = this._tag;
    this.status = status;
  }
}

/**AuthorizationError
 * Authorization not granted
 */
class UserIdError extends CustomError {
  readonly _tag = 'UserIdError';
  status: number;

  constructor(
    public message: string = 'Error to parse or get userId',
    status: number = 403,
    cause?: string,
  ) {
    super(message, status, cause);
    this.name = this._tag;
    this.status = status;
  }
}

/** NotFoundError
 * Requested data not found
 */
class NotFoundError extends CustomError {
  readonly _tag = 'NotFoundError';
  status: number;

  constructor(
    public message: string = 'The requested resource was not found',
    status: number = 404,
    cause?: string,
  ) {
    super(message, status, cause);
    this.cause = cause;
    this.status = status;
    this.name = this._tag;
  }
}

/** BadRequestError
 * Request is not good
 */
class BadRequestError extends CustomError {
  readonly _tag = 'BadRequestError';
  status: number;

  constructor(
    public message: string = 'Your requested is not valid',
    status: number = HttpStatus.BAD_REQUEST,
    cause?: string,
  ) {
    super(message, status, cause);
    this.cause = cause;
    this.status = status;
    this.name = this._tag;
  }
}

/** DatabaseError
 * Database related error
 */
class DatabaseError extends CustomError {
  readonly _tag = 'DatabaseError';
  status: number;

  constructor(
    public message: string = 'A persistence storage error occurred',
    status: number,
    cause?: string,
  ) {
    super(message, status, cause);
    this.cause = cause;
    this.status = status;
    this.name = this._tag;
  }
}

/** ValidationError
 * Schema validation error
 */
class ValidationError extends CustomError {
  readonly _tag = 'ValidationError';
  status: number;

  constructor(
    public message: string = 'Input validation failed',
    status: number = HttpStatus.BAD_REQUEST,
    cause?: string,
  ) {
    super(message, status, cause);
    this.cause = cause;
    this.status = status;
    this.name = this._tag;
  }
}

/** ConflictError
 * For conflicts, such as duplicate records or invalid state transitions.
 */
class ConflictError extends CustomError {
  readonly _tag = 'ConflictError';
  status: number;

  constructor(
    public message: string = 'Conflict occurred with the current state of the resource',
    status: number = 409,
    cause?: string,
  ) {
    super(message, status, cause);
    this.cause = cause;
    this.status = status;
    this.name = this._tag;
  }
}

class FileUploadError extends CustomError {
  readonly _tag = 'FileUploadError';
  status: number;

  constructor(
    public message: string = 'Error uploading file',
    status: number = HttpStatus.BAD_REQUEST,
    cause?: string,
  ) {
    super(message, status, cause);
    this.cause = cause;
    this.status = status;
    this.name = this._tag;
  }
}

/** InternalServerError
 * For unexpected server errors.
 */
class InternalServerError extends CustomError {
  readonly _tag = 'InternalServerError';
  status: number;

  constructor(
    public message: string = 'An unexpected error occurred',
    status: number = 500,
    cause?: string,
  ) {
    super(message, status, cause);
    this.cause = cause;
    this.status = status;
    this.name = this._tag;
  }
}

/** TimeoutError
 * For request or operation timeouts.
 */
class TimeoutError extends Error {
  readonly _tag = 'TimeoutError';
  status: number;

  constructor(
    public message: string = 'The operation timed out',
    status: number = 504,
    cause?: string,
  ) {
    super(message, { cause });
    this.status = status;
    this.name = this._tag;
  }
}

/** ServiceUnavailableError
 * For unavailable or overloaded internal services.
 */
class ServiceUnavailableError extends Error {
  readonly _tag = 'ServiceUnavailableError';
  status: number;

  constructor(
    public message: string = 'The service is temporarily unavailable',
    status: number = 503,
    cause?: string,
  ) {
    super(message, { cause });
    this.status = status;
    this.name = this._tag;
  }
}

export {
  DatabaseError,
  MissingParameterError,
  BadRequestError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  ConflictError,
  InternalServerError,
  TimeoutError,
  ServiceUnavailableError,
  UserIdError,
  FileUploadError,
};
