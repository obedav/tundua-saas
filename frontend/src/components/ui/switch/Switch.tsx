import { forwardRef, InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gray-200 data-[state=checked]:bg-primary-600 focus:ring-primary-500",
        success:
          "bg-gray-200 data-[state=checked]:bg-green-600 focus:ring-green-500",
        danger:
          "bg-gray-200 data-[state=checked]:bg-red-600 focus:ring-red-500",
      },
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const switchThumbVariants = cva(
  "pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[state=checked]:translate-x-4",
        md: "h-5 w-5 data-[state=checked]:translate-x-5",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof switchVariants> {
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Additional class for wrapper */
  wrapperClassName?: string;
  /** Label position */
  labelPosition?: "left" | "right";
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      variant,
      size,
      label,
      description,
      error,
      wrapperClassName,
      labelPosition = "right",
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const switchElement = (
      <div className="relative">
        <input
          type="checkbox"
          ref={ref}
          disabled={disabled}
          checked={checked}
          className="sr-only peer"
          data-state={checked ? "checked" : "unchecked"}
          {...props}
        />
        <div
          className={cn(
            switchVariants({ variant, size }),
            error && "focus:ring-red-500",
            className
          )}
          data-state={checked ? "checked" : "unchecked"}
        >
          <span
            className={cn(switchThumbVariants({ size }))}
            data-state={checked ? "checked" : "unchecked"}
            aria-hidden="true"
          />
        </div>
      </div>
    );

    if (!label && !description) {
      return switchElement;
    }

    return (
      <div
        className={cn(
          "flex items-start gap-3",
          labelPosition === "left" && "flex-row-reverse justify-between",
          wrapperClassName
        )}
      >
        {switchElement}

        {/* Label & Description */}
        <div className="flex-1">
          {label && (
            <label
              htmlFor={props.id}
              className={cn(
                "text-sm font-medium text-gray-900 cursor-pointer select-none block",
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
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch, switchVariants };
