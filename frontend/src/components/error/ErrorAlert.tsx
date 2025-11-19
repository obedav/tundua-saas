"use client";

import { useState } from "react";
import { Alert } from "@/components/ui";
import { AlertTriangle, X } from "lucide-react";

interface ErrorAlertProps {
  /** Error message to display */
  message?: string;
  /** Error object */
  error?: Error | unknown;
  /** Title for the error alert */
  title?: string;
  /** Show close button */
  closable?: boolean;
  /** Callback when alert is closed */
  onClose?: () => void;
  /** Additional class names */
  className?: string;
  /** Show retry button */
  onRetry?: () => void;
}

/**
 * ErrorAlert Component
 * Displays error messages in a user-friendly format
 *
 * Usage:
 * <ErrorAlert message="Failed to load data" onRetry={handleRetry} />
 */
export function ErrorAlert({
  message,
  error,
  title = "Error",
  closable = true,
  onClose,
  className,
  onRetry,
}: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  // Extract error message
  let errorMessage = message;
  if (!errorMessage && error) {
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String((error as any).message);
    } else {
      errorMessage = "An unexpected error occurred";
    }
  }

  return (
    <Alert
      variant="danger"
      title={title}
      closable={closable}
      onClose={handleClose}
      className={className}
    >
      <p className="mb-3">{errorMessage || "An unexpected error occurred"}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-semibold text-red-700 hover:text-red-800 underline underline-offset-2"
        >
          Try again
        </button>
      )}
    </Alert>
  );
}

interface FormErrorProps {
  /** Array of error messages */
  errors?: string[];
  /** Single error message */
  error?: string;
  /** Show as list */
  asList?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * FormError Component
 * Displays form-level errors in a consistent format
 *
 * Usage:
 * <FormError errors={["Email is required", "Password is too short"]} />
 */
export function FormError({
  errors,
  error,
  asList = true,
  className,
}: FormErrorProps) {
  const errorList = errors || (error ? [error] : []);

  if (errorList.length === 0) return null;

  if (errorList.length === 1) {
    return (
      <Alert variant="danger" className={className}>
        {errorList[0]}
      </Alert>
    );
  }

  return (
    <Alert variant="danger" title="Please fix the following errors" className={className}>
      {asList ? (
        <ul className="list-disc list-inside space-y-1 text-sm">
          {errorList.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      ) : (
        <div className="space-y-1 text-sm">
          {errorList.map((err, index) => (
            <p key={index}>• {err}</p>
          ))}
        </div>
      )}
    </Alert>
  );
}

interface ApiErrorProps {
  /** API error response */
  error: any;
  /** Fallback message if error can't be parsed */
  fallback?: string;
  /** Show retry button */
  onRetry?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * ApiError Component
 * Displays API errors in a user-friendly format
 * Handles various API error response formats
 *
 * Usage:
 * <ApiError error={apiError} onRetry={refetch} />
 */
export function ApiError({
  error,
  fallback = "Failed to load data. Please try again.",
  onRetry,
  className,
}: ApiErrorProps) {
  // Parse API error
  let errorMessage = fallback;
  let errorTitle = "Error";

  if (error?.response?.data) {
    const data = error.response.data;
    errorMessage = data.message || data.error || fallback;
    if (data.errors && Array.isArray(data.errors)) {
      return (
        <FormError
          errors={data.errors.map((e: any) => e.message || e)}
          className={className}
        />
      );
    }
  } else if (error?.message) {
    errorMessage = error.message;
  }

  // Set title based on status code
  if (error?.response?.status) {
    const status = error.response.status;
    if (status === 404) errorTitle = "Not Found";
    else if (status === 403) errorTitle = "Access Denied";
    else if (status === 401) errorTitle = "Unauthorized";
    else if (status >= 500) errorTitle = "Server Error";
  }

  return (
    <ErrorAlert
      title={errorTitle}
      message={errorMessage}
      onRetry={onRetry}
      className={className}
    />
  );
}
