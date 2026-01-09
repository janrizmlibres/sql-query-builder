import { RequestError } from "@/lib/http-errors";
import logger from "@/lib/logger";

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
