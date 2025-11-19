import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Variant of skeleton */
  variant?: "text" | "circular" | "rectangular";
  /** Width of skeleton */
  width?: string | number;
  /** Height of skeleton */
  height?: string | number;
  /** Number of lines (for text variant) */
  lines?: number;
}

function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  lines = 1,
  style,
  ...props
}: SkeletonProps) {
  const baseClasses = "animate-skeleton bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]";

  const variantClasses = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const inlineStyles = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    ...style,
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses.text,
              index === lines - 1 && "w-4/5", // Last line is shorter
              className
            )}
            style={inlineStyles}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={inlineStyles}
      {...props}
    />
  );
}

Skeleton.displayName = "Skeleton";

// Compound Components for common patterns
const SkeletonCard = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-4 p-6 border border-gray-100 rounded-2xl bg-white", className)} {...props}>
    <Skeleton variant="text" width="60%" height={24} />
    <Skeleton variant="text" lines={3} />
    <div className="flex gap-2 mt-4">
      <Skeleton variant="rectangular" width={100} height={36} />
      <Skeleton variant="rectangular" width={100} height={36} />
    </div>
  </div>
);

const SkeletonAvatar = ({ size = 40, className, ...props }: { size?: number } & HTMLAttributes<HTMLDivElement>) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    className={className}
    {...props}
  />
);

const SkeletonList = ({ items = 3, className, ...props }: { items?: number } & HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-4", className)} {...props}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center gap-4">
        <SkeletonAvatar size={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" height={14} />
        </div>
      </div>
    ))}
  </div>
);

const SkeletonTable = ({ rows = 5, columns = 4, className, ...props }: { rows?: number; columns?: number } & HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-3", className)} {...props}>
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={`header-${index}`} variant="text" height={20} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" height={16} />
        ))}
      </div>
    ))}
  </div>
);

const SkeletonDashboardStats = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)} {...props}>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="p-6 border border-gray-100 rounded-2xl bg-white space-y-3">
        <Skeleton variant="text" width="50%" height={16} />
        <Skeleton variant="text" width="70%" height={32} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    ))}
  </div>
);

export {
  Skeleton,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonList,
  SkeletonTable,
  SkeletonDashboardStats,
};
