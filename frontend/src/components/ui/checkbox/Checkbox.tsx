import { forwardRef, InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";

const checkboxVariants = cva(
  "peer h-5 w-5 shrink-0 rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 text-white bg-white hover:border-gray-400 focus:ring-primary-500 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600 data-[state=indeterminate]:bg-primary-600 data-[state=indeterminate]:border-primary-600",
        success:
          "border-gray-300 text-white bg-white hover:border-gray-400 focus:ring-green-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=indeterminate]:bg-green-600 data-[state=indeterminate]:border-green-600",
        danger:
          "border-gray-300 text-white bg-white hover:border-gray-400 focus:ring-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 data-[state=indeterminate]:bg-red-600 data-[state=indeterminate]:border-red-600",
      },
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof checkboxVariants> {
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Indeterminate state (for partial selection) */
  indeterminate?: boolean;
  /** Additional class for wrapper */
  wrapperClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      variant,
      size,
      label,
      description,
      error,
      indeterminate = false,
      wrapperClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex items-start", wrapperClassName)}>
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              type="checkbox"
              ref={ref}
              disabled={disabled}
              className={cn(
                checkboxVariants({ variant, size }),
                "appearance-none cursor-pointer",
                error && "border-red-500 focus:ring-red-500",
                className
              )}
              data-state={
                indeterminate ? "indeterminate" : props.checked ? "checked" : "unchecked"
              }
              {...props}
            />
            {/* Checkmark Icon */}
            {props.checked && !indeterminate && (
              <Check
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white",
                  size === "sm" && "h-3 w-3",
                  size === "md" && "h-4 w-4",
                  size === "lg" && "h-5 w-5"
                )}
                strokeWidth={3}
                aria-hidden="true"
              />
            )}
            {/* Indeterminate Icon */}
            {indeterminate && (
              <Minus
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white",
                  size === "sm" && "h-3 w-3",
                  size === "md" && "h-4 w-4",
                  size === "lg" && "h-5 w-5"
                )}
                strokeWidth={3}
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        {/* Label & Description */}
        {(label || description) && (
          <div className="ml-3 flex-1">
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  "text-sm font-medium text-gray-900 cursor-pointer select-none",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                className={cn(
                  "text-sm text-gray-600 mt-0.5",
                  disabled && "opacity-50"
                )}
              >
                {description}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 mt-1" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
