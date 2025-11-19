import {
  HTMLAttributes,
  forwardRef,
  useEffect,
  useRef,
  ReactNode,
  MouseEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

const modalOverlayVariants = cva(
  "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300",
  {
    variants: {
      state: {
        entering: "animate-fade-in",
        entered: "opacity-100",
        exiting: "animate-fade-out",
        exited: "opacity-0",
      },
    },
    defaultVariants: {
      state: "entered",
    },
  }
);

const modalContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-white rounded-2xl shadow-elevation-5 transition-all duration-300 max-h-[90vh] overflow-auto",
  {
    variants: {
      size: {
        sm: "w-full max-w-md p-6",
        md: "w-full max-w-lg p-6",
        lg: "w-full max-w-2xl p-8",
        xl: "w-full max-w-4xl p-8",
        full: "w-[95vw] h-[95vh] p-8",
      },
      animation: {
        fade: "animate-fade-in",
        slide: "animate-slide-up",
        scale: "animate-scale-in",
      },
    },
    defaultVariants: {
      size: "md",
      animation: "scale",
    },
  }
);

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof modalContentVariants> {
  /** Whether the modal is open */
  open?: boolean;
  /** Callback when modal is closed */
  onClose?: () => void;
  /** Modal title */
  title?: ReactNode;
  /** Modal description */
  description?: ReactNode;
  /** Hide close button */
  hideCloseButton?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Footer content */
  footer?: ReactNode;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      size,
      animation,
      open = false,
      onClose,
      title,
      description,
      hideCloseButton = false,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      footer,
      children,
      ...props
    },
    ref
  ) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Handle escape key
    useEffect(() => {
      if (!open || !closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && onClose) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [open, closeOnEscape, onClose]);

    // Focus management
    useEffect(() => {
      if (open) {
        // Store currently focused element
        previousActiveElement.current = document.activeElement as HTMLElement;

        // Focus modal content
        setTimeout(() => {
          contentRef.current?.focus();
        }, 100);

        // Prevent body scroll
        document.body.style.overflow = "hidden";
      } else {
        // Restore focus
        previousActiveElement.current?.focus();

        // Restore body scroll
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);

    // Focus trap
    useEffect(() => {
      if (!open) return;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        const focusableElements = contentRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", handleTabKey);
      return () => document.removeEventListener("keydown", handleTabKey);
    }, [open]);

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && onClose && e.target === e.currentTarget) {
        onClose();
      }
    };

    if (!open) return null;

    const modalContent = (
      <>
        {/* Overlay */}
        <div
          className={cn(modalOverlayVariants({ state: "entered" }))}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
          tabIndex={-1}
          className={cn(modalContentVariants({ size, animation, className }))}
          {...props}
        >
          {/* Header */}
          {(title || description || !hideCloseButton) && (
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 space-y-1">
                {title && (
                  <h2
                    id="modal-title"
                    className="text-2xl font-bold text-gray-900 leading-tight"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="modal-description"
                    className="text-sm text-gray-600 leading-relaxed"
                  >
                    {description}
                  </p>
                )}
              </div>

              {/* Close Button */}
              {!hideCloseButton && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-4 flex-shrink-0 rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="modal-body">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
              {footer}
            </div>
          )}
        </div>
      </>
    );

    // Render in portal
    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = "Modal";

// Compound Components
const ModalHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 mb-6", className)}
    {...props}
  />
));

ModalHeader.displayName = "ModalHeader";

const ModalTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-2xl font-bold text-gray-900 leading-tight tracking-tight",
      className
    )}
    {...props}
  />
));

ModalTitle.displayName = "ModalTitle";

const ModalDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  />
));

ModalDescription.displayName = "ModalDescription";

const ModalContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("py-4", className)} {...props} />
  )
);

ModalContent.displayName = "ModalContent";

const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100",
        className
      )}
      {...props}
    />
  )
);

ModalFooter.displayName = "ModalFooter";

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
  modalContentVariants,
};
