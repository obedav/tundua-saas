import { forwardRef, InputHTMLAttributes, useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

const inputVariants = cva(
  // Base styles with dark mode support
  "flex w-full rounded-xl border-2 bg-white dark:bg-gray-800 px-4 py-3 text-base text-gray-900 dark:text-white transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-500 dark:disabled:text-gray-600",
  {
    variants: {
      state: {
        default:
          "border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500 hover:border-gray-300 dark:hover:border-gray-500",
        error:
          "border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500 text-red-900 dark:text-red-400 placeholder:text-red-400",
        success:
          "border-green-300 dark:border-green-500/50 focus:border-green-500 focus:ring-green-500",
        warning:
          "border-yellow-300 dark:border-yellow-500/50 focus:border-yellow-500 focus:ring-yellow-500",
      },
      inputSize: {
        sm: "h-9 px-3 py-2 text-sm",
        md: "h-11 px-4 py-2.5 text-base",
        lg: "h-12 px-5 py-3 text-lg",
      },
    },
    defaultVariants: {
      state: "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Label for the input */
  label?: string;
  /** Helper text shown below the input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Icon to show on the left */
  leftIcon?: React.ReactNode;
  /** Icon to show on the right */
  rightIcon?: React.ReactNode;
  /** Additional className for the wrapper */
  wrapperClassName?: string;
  /** Make label required */
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      state,
      inputSize,
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      wrapperClassName,
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine the actual state based on props
    const actualState = error
      ? "error"
      : success
      ? "success"
      : state || "default";

    // Generate stable IDs for accessibility (consistent across server/client)
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const descriptionId = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
          >
            {label}
            {required && (
              <span className="text-red-600 dark:text-red-400 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({ state: actualState, inputSize }),
              leftIcon && "pl-12",
              (rightIcon || error || success) && "pr-12",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={descriptionId}
            aria-required={required}
            disabled={disabled}
            {...props}
          />

          {/* Right Icon / State Icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {error && (
              <AlertCircle
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            )}
            {success && !error && (
              <CheckCircle2
                className="h-5 w-5 text-green-500"
                aria-hidden="true"
              />
            )}
            {!error && !success && rightIcon && (
              <span className="text-gray-400 dark:text-gray-500">{rightIcon}</span>
            )}
          </div>
        </div>

        {/* Helper Text / Error / Success */}
        {(helperText || error || success) && (
          <div className="mt-2">
            {error && (
              <p
                id={errorId}
                className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </p>
            )}
            {success && !error && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>{success}</span>
              </p>
            )}
            {helperText && !error && !success && (
              <p id={helperId} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                <Info className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                <span>{helperText}</span>
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
