import {
  useState,
  useRef,
  useEffect,
  ReactNode,
  HTMLAttributes,
  cloneElement,
  isValidElement,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

const tooltipVariants = cva(
  "absolute z-50 rounded-lg px-3 py-2 text-sm font-medium shadow-elevation-3 transition-all duration-200 pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white",
        light: "bg-white text-gray-900 border border-gray-200",
        primary: "bg-primary-600 text-white",
        success: "bg-green-600 text-white",
        warning: "bg-yellow-600 text-white",
        danger: "bg-red-600 text-white",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-2",
        lg: "text-base px-4 py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const arrowVariants = {
  default: "fill-gray-900",
  light: "fill-white stroke-gray-200",
  primary: "fill-primary-600",
  success: "fill-green-600",
  warning: "fill-yellow-600",
  danger: "fill-red-600",
};

type Placement = "top" | "bottom" | "left" | "right";

export interface TooltipProps
  extends VariantProps<typeof tooltipVariants> {
  /** Tooltip content */
  content: ReactNode;
  /** Trigger element */
  children: ReactNode;
  /** Tooltip placement */
  placement?: Placement;
  /** Delay before showing (ms) */
  delay?: number;
  /** Show arrow */
  showArrow?: boolean;
  /** Disable tooltip */
  disabled?: boolean;
  /** Additional class for tooltip container */
  className?: string;
  /** Additional class for trigger wrapper */
  wrapperClassName?: string;
}

const Tooltip = ({
  content,
  children,
  placement = "top",
  delay = 200,
  showArrow = true,
  disabled = false,
  variant = "default",
  size,
  className,
  wrapperClassName,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState<Placement>(placement);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 8; // Gap between trigger and tooltip
    const arrowSize = showArrow ? 6 : 0;

    let top = 0;
    let left = 0;
    let finalPlacement = placement;

    // Calculate initial position based on placement
    switch (placement) {
      case "top":
        top = triggerRect.top - tooltipRect.height - gap - arrowSize;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

        // Flip to bottom if not enough space
        if (top < 0) {
          finalPlacement = "bottom";
          top = triggerRect.bottom + gap + arrowSize;
        }
        break;

      case "bottom":
        top = triggerRect.bottom + gap + arrowSize;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

        // Flip to top if not enough space
        if (top + tooltipRect.height > window.innerHeight) {
          finalPlacement = "top";
          top = triggerRect.top - tooltipRect.height - gap - arrowSize;
        }
        break;

      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - gap - arrowSize;

        // Flip to right if not enough space
        if (left < 0) {
          finalPlacement = "right";
          left = triggerRect.right + gap + arrowSize;
        }
        break;

      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + gap + arrowSize;

        // Flip to left if not enough space
        if (left + tooltipRect.width > window.innerWidth) {
          finalPlacement = "left";
          left = triggerRect.left - tooltipRect.width - gap - arrowSize;
        }
        break;
    }

    // Keep tooltip within viewport bounds (horizontal)
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }

    // Keep tooltip within viewport bounds (vertical)
    if (top < 8) top = 8;
    if (top + tooltipRect.height > window.innerHeight - 8) {
      top = window.innerHeight - tooltipRect.height - 8;
    }

    setPosition({ top, left });
    setActualPlacement(finalPlacement);
  };

  const showTooltip = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();

      // Recalculate on scroll or resize
      const handleUpdate = () => calculatePosition();
      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate);

      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate);
      };
    }
  }, [isVisible]);

  // Clone child element to add event handlers
  const trigger = isValidElement(children) ? (
    cloneElement(children as React.ReactElement<any>, {
      "aria-describedby": isVisible ? tooltipId.current : undefined,
    })
  ) : (
    children
  );

  const tooltipContent = isVisible
    ? createPortal(
        <div
          ref={tooltipRef}
          id={tooltipId.current}
          role="tooltip"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          className={cn(
            tooltipVariants({ variant, size, className }),
            "animate-fade-in"
          )}
        >
          {content}

          {/* Arrow */}
          {showArrow && (
            <svg
              className={cn(
                "absolute w-3 h-3",
                arrowVariants[variant || "default"],
                {
                  "bottom-[-6px] left-1/2 -translate-x-1/2 rotate-180":
                    actualPlacement === "top",
                  "top-[-6px] left-1/2 -translate-x-1/2":
                    actualPlacement === "bottom",
                  "right-[-6px] top-1/2 -translate-y-1/2 rotate-90":
                    actualPlacement === "left",
                  "left-[-6px] top-1/2 -translate-y-1/2 -rotate-90":
                    actualPlacement === "right",
                }
              )}
              viewBox="0 0 12 12"
            >
              <path d="M6 0L12 12H0L6 0Z" />
            </svg>
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={cn("inline-flex", wrapperClassName)}
      >
        {trigger}
      </div>
      {tooltipContent}
    </>
  );
};

Tooltip.displayName = "Tooltip";

export { Tooltip, tooltipVariants };
