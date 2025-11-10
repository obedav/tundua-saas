/**
 * Optimized Image Component
 *
 * Wrapper around Next.js Image with built-in optimizations:
 * - Automatic blur placeholder
 * - Lazy loading by default
 * - Responsive sizing
 * - Error handling
 * - Fallback images
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   width={1200}
 *   height={600}
 * />
 * ```
 */

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
  /**
   * Fallback image to show if main image fails to load
   * Defaults to a placeholder pattern
   */
  fallbackSrc?: string;

  /**
   * Whether to show a blur placeholder while loading
   * Uses blur data URL for better UX
   * @default true
   */
  showBlurPlaceholder?: boolean;

  /**
   * Custom blur data URL
   * If not provided, uses a simple gray blur
   */
  blurDataURL?: string;
}

/**
 * Generate a simple blur placeholder
 * This is a tiny SVG that acts as a blur placeholder
 */
function generateBlurDataURL(width: number, height: number): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#e5e7eb"/>
    </svg>
  `;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Default fallback image (minimal SVG placeholder)
 */
const DEFAULT_FALLBACK = `data:image/svg+xml;base64,${Buffer.from(`
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="50%" y="50%" font-family="system-ui" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
      Image not available
    </text>
  </svg>
`).toString('base64')}`;

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fallbackSrc = DEFAULT_FALLBACK,
  showBlurPlaceholder = true,
  blurDataURL,
  loading = 'lazy', // Lazy loading by default
  quality = 85, // Good balance between quality and file size
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder if enabled
  const placeholder = showBlurPlaceholder ? 'blur' : 'empty';
  const blurData =
    blurDataURL ||
    (typeof width === 'number' && typeof height === 'number'
      ? generateBlurDataURL(width, height)
      : undefined);

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurData}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}

/**
 * Optimized Background Image Component
 *
 * For images used as backgrounds with content on top
 *
 * @example
 * ```tsx
 * <OptimizedBackgroundImage src="/bg.jpg" alt="Background">
 *   <h1>Content on top</h1>
 * </OptimizedBackgroundImage>
 * ```
 */
interface BackgroundImageProps extends OptimizedImageProps {
  children?: React.ReactNode;
  className?: string;
  overlay?: boolean;
  overlayClassName?: string;
}

export function OptimizedBackgroundImage({
  children,
  className = '',
  overlay = false,
  overlayClassName = 'bg-black/50',
  ...imageProps
}: BackgroundImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Image */}
      <OptimizedImage
        {...imageProps}
        fill
        className="object-cover"
        sizes="100vw"
        priority={imageProps.priority}
      />

      {/* Optional overlay */}
      {overlay && <div className={`absolute inset-0 ${overlayClassName}`} />}

      {/* Content on top */}
      {children && (
        <div className="relative z-10">{children}</div>
      )}
    </div>
  );
}

/**
 * Avatar Image Component
 *
 * Optimized for profile pictures and avatars
 * Includes rounded styling and fallback
 *
 * @example
 * ```tsx
 * <AvatarImage
 *   src="/avatar.jpg"
 *   alt="User Name"
 *   size={64}
 * />
 * ```
 */
interface AvatarImageProps extends Omit<OptimizedImageProps, 'width' | 'height'> {
  size: number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export function AvatarImage({
  size,
  rounded = 'full',
  className = '',
  ...props
}: AvatarImageProps) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <OptimizedImage
      {...props}
      width={size}
      height={size}
      className={`${roundedClasses[rounded]} ${className}`}
    />
  );
}
