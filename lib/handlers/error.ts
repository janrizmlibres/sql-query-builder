import { RequestError } from "@/lib/http-errors";
import logger from "@/lib/logger";

/**
 * Formats the error response in the application's standard format.
 * 
 * @param status - The status code of the error.
 * @param message - The message of the error.
 * @param errors - The details of the error.
 * @returns The formatted error response.
 */
const formatResponse = (
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return { status, ...responseContent };
};

/**
 * Handles errors across the application.
 * All server-side actions should use this function to return unsuccessful requests.
 * 
 * @param error - The error to handle.
 * @returns The formatted error response.
 */
const handleError = (error: unknown) => {
  if (error instanceof RequestError) {
    logger.error(
      { err: error },
      `Error: ${error.message}`
    );

    return formatResponse(
      error.statusCode,
      error.message,
      error.errors
    );
  }

  if (error instanceof Error) {
    logger.error(error.message);
    return formatResponse(500, error.message);
  }

  logger.error({ err: error }, "An unexpected error occurred");
  return formatResponse(500, "An unexpected error occurred.");
};

export default handleError;
