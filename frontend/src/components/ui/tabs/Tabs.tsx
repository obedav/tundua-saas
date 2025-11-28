import { useState, ReactNode, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tabsListVariants = cva("inline-flex items-center gap-1", {
  variants: {
    variant: {
      default: "border-b border-gray-200 w-full",
      pills: "p-1 bg-gray-100 rounded-xl",
      buttons: "gap-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-b-2 border-transparent px-4 py-3 text-gray-600 hover:text-gray-900 hover:border-gray-300 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 data-[state=active]:font-semibold",
        pills:
          "rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold",
        buttons:
          "rounded-xl px-4 py-2.5 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=active]:border-primary-600 data-[state=active]:shadow-lg data-[state=active]:shadow-primary-500/30",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
}

export interface TabsProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {
  /** Array of tab items */
  items: TabItem[];
  /** Default active tab value */
  defaultValue?: string;
  /** Controlled active tab value */
  value?: string;
  /** Callback when tab changes */
  onValueChange?: (value: string) => void;
  /** Size of tabs */
  size?: "sm" | "md" | "lg";
}

export function Tabs({
  items,
  defaultValue,
  value: controlledValue,
  onValueChange,
  variant = "default",
  size = "md",
  className,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue || items[0]?.value || ""
  );

  const activeValue = controlledValue !== undefined ? controlledValue : internalValue;

  const handleTabChange = (value: string) => {
    if (controlledValue === undefined) {
      setInternalValue(value);
    }
    onValueChange?.(value);
  };

  const activeTab = items.find((item) => item.value === activeValue);

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Tab List */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={cn(tabsListVariants({ variant }))}
      >
        {items.map((item) => (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={activeValue === item.value}
            aria-controls={`tabpanel-${item.value}`}
            id={`tab-${item.value}`}
            disabled={item.disabled}
            onClick={() => !item.disabled && handleTabChange(item.value)}
            className={cn(
              tabsTriggerVariants({ variant, size }),
              item.disabled && "cursor-not-allowed"
            )}
            data-state={activeValue === item.value ? "active" : "inactive"}
          >
            {item.icon && (
              <span className="mr-2 inline-flex" aria-hidden="true">
                {item.icon}
              </span>
            )}
            {item.label}
            {item.badge && (
              <span className="ml-2 inline-flex" aria-hidden="true">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab && (
        <div
          key={activeTab.value}
          role="tabpanel"
          id={`tabpanel-${activeTab.value}`}
          aria-labelledby={`tab-${activeTab.value}`}
          className="mt-6 focus:outline-none animate-fade-in"
          tabIndex={0}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}

Tabs.displayName = "Tabs";

export { tabsListVariants, tabsTriggerVariants };
