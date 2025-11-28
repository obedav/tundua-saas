import { forwardRef, InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const radioVariants = cva(
  "peer h-5 w-5 shrink-0 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 bg-white hover:border-gray-400 focus:ring-primary-500 data-[state=checked]:border-primary-600 data-[state=checked]:border-[6px]",
        success:
          "border-gray-300 bg-white hover:border-gray-400 focus:ring-green-500 data-[state=checked]:border-green-600 data-[state=checked]:border-[6px]",
        danger:
          "border-gray-300 bg-white hover:border-gray-400 focus:ring-red-500 data-[state=checked]:border-red-600 data-[state=checked]:border-[6px]",
      },
      size: {
        sm: "h-4 w-4 data-[state=checked]:border-[5px]",
        md: "h-5 w-5 data-[state=checked]:border-[6px]",
        lg: "h-6 w-6 data-[state=checked]:border-[7px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof radioVariants> {
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Additional class for wrapper */
  wrapperClassName?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      variant,
      size,
      label,
      description,
      error,
      wrapperClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex items-start", wrapperClassName)}>
        <div className="flex items-center h-5">
          <input
            type="radio"
            ref={ref}
            disabled={disabled}
            className={cn(
              radioVariants({ variant, size }),
              "appearance-none cursor-pointer",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            data-state={props.checked ? "checked" : "unchecked"}
            {...props}
          />
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

Radio.displayName = "Radio";

// Radio Group Component for managing multiple radio buttons
export interface RadioGroupProps {
  /** Radio group name */
  name: string;
  /** Selected value */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Radio options */
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  /** Variant for all radios */
  variant?: RadioProps["variant"];
  /** Size for all radios */
  size?: RadioProps["size"];
  /** Error message */
  error?: string;
  /** Additional class for wrapper */
  className?: string;
  /** Stack direction */
  direction?: "vertical" | "horizontal";
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      value,
      onChange,
      options,
      variant,
      size,
      error,
      className,
      direction = "vertical",
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "space-y-3",
          direction === "horizontal" && "flex flex-wrap gap-6 space-y-0",
          className
        )}
        role="radiogroup"
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            variant={variant}
            size={size}
          />
        ))}
        {error && (
          <p className="text-sm text-red-600 mt-2" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { Radio, RadioGroup, radioVariants };
