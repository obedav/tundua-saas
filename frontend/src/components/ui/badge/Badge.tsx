import { HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600",
        primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50",
        secondary: "bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-900/50",
        success: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50",
        warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50",
        danger: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50",
        info: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50",
        outline: "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
      },
      dot: {
        true: "pl-1.5",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      dot: false,
    },
  }
);

const dotVariants = {
  default: "bg-gray-600 dark:bg-gray-400",
  primary: "bg-primary-600 dark:bg-primary-400",
  secondary: "bg-secondary-600 dark:bg-secondary-400",
  success: "bg-green-600 dark:bg-green-400",
  warning: "bg-yellow-600 dark:bg-yellow-400",
  danger: "bg-red-600 dark:bg-red-400",
  info: "bg-blue-600 dark:bg-blue-400",
  outline: "bg-gray-600 dark:bg-gray-400",
};

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Show a colored dot indicator */
  dot?: boolean;
  /** Make badge removable */
  removable?: boolean;
  /** Callback when badge is removed */
  onRemove?: () => void;
  /** Icon to show before content */
  icon?: React.ReactNode;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size,
      dot = false,
      removable = false,
      onRemove,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, dot, className }))}
        {...props}
      >
        {/* Dot Indicator */}
        {dot && (
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              dotVariants[variant || "default"]
            )}
            aria-hidden="true"
          />
        )}

        {/* Icon */}
        {icon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Content */}
        {children && <span>{children}</span>}

        {/* Remove Button */}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex shrink-0 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current rounded-full"
            aria-label="Remove"
          >
            <X className="w-3 h-3" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
