/**
 * Standard error class for HTTP requests. Used to standardize error responses across
 * the application for consistency.
 */
export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "RequestError";
  }
}

/**
 * Error class for 404 Not Found responses.
 */
export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(404, `${resource} not found.`);
    this.name = "NotFoundError";
  }
}
