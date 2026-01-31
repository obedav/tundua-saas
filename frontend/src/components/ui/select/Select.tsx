import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  SelectHTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search, X } from "lucide-react";

const selectVariants = cva(
  "flex w-full items-center justify-between rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500",
        error: "border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500",
        success: "border-green-300 dark:border-green-500/50 focus:border-green-500 focus:ring-green-500",
      },
      size: {
        sm: "h-9 text-xs px-3 py-2",
        md: "h-11 text-sm px-4 py-3",
        lg: "h-12 text-base px-4 py-3",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
    },
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  /** Select label */
  label?: string;
  /** Helper text */
  helper?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Select options */
  options: SelectOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Enable search */
  searchable?: boolean;
  /** Additional class for wrapper */
  wrapperClassName?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      state,
      size,
      label,
      helper,
      error,
      success,
      options,
      placeholder = "Select an option",
      searchable = false,
      wrapperClassName,
      disabled,
      value,
      onValueChange,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedValue, setSelectedValue] = useState(value || "");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Get selected option label
    const selectedOption = options.find((opt) => opt.value === selectedValue);
    const displayText = selectedOption?.label || placeholder;

    // Filter options based on search
    const filteredOptions = searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchable) {
        searchInputRef.current?.focus();
      }
    }, [isOpen, searchable]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onValueChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery("");
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedValue("");
      onValueChange?.("");
    };

    // Determine state based on error/success
    const finalState = error ? "error" : success ? "success" : state;

    return (
      <div className={cn("w-full", wrapperClassName)} ref={ref}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            {label}
          </label>
        )}

        {/* Select Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(
              selectVariants({ state: finalState, size }),
              "cursor-pointer",
              className
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span
              className={cn(
                "flex-1 text-left truncate",
                !selectedValue && "text-gray-500 dark:text-gray-400"
              )}
            >
              {displayText}
            </span>
            <div className="flex items-center gap-1">
              {selectedValue && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  aria-label="Clear selection"
                >
                  <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </button>
              )}
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-gray-400 transition-transform",
                  isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </div>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-elevation-3 dark:shadow-gray-900/30 animate-fade-in">
              {/* Search Input */}
              {searchable && (
                <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500"
                      aria-hidden="true"
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="max-h-60 overflow-auto p-1" role="listbox">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors text-left",
                        option.value === selectedValue
                          ? "bg-primary-50 dark:bg-primary-900/30 text-primary-900 dark:text-primary-300 font-medium"
                          : "text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700",
                        option.disabled && "opacity-50 cursor-not-allowed"
                      )}
                      role="option"
                      aria-selected={option.value === selectedValue}
                    >
                      <span className="truncate">{option.label}</span>
                      {option.value === selectedValue && (
                        <Check
                          className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0 ml-2"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Helper/Error/Success Text */}
        {helper && !error && !success && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{helper}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        {success && !error && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">{success}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select, selectVariants };
