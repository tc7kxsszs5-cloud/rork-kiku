/**
 * Utility functions for error handling and detection
 */

/**
 * Checks if an error is a network-related error
 * @param error - The error to check (can be Error, string, or any type)
 * @returns true if the error is network-related
 */
export const isNetworkError = (error: unknown): boolean => {
  if (!error) {
    return false;
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  return (
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('network') ||
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('abort') ||
    lowerMessage.includes('connection')
  );
};

/**
 * Formats an error for structured logging
 * @param error - The error to format
 * @returns A string representation of the error
 */
export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};
