/**
 * Document Quality Validation Utility
 * Modern 2026 standard for ensuring uploaded documents meet quality requirements
 */

export interface QualityCheckResult {
  passed: boolean;
  score: number; // 0-100
  warnings: string[];
  suggestions: string[];
  details: {
    resolution?: { width: number; height: number };
    fileSize?: number;
    brightness?: number;
    contrast?: number;
    sharpness?: number;
  };
}

/**
 * Check image quality for document uploads
 * Analyzes resolution, brightness, contrast, and sharpness
 */
export async function checkImageQuality(file: File): Promise<QualityCheckResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            passed: true,
            score: 50,
            warnings: ['Could not analyze image quality'],
            suggestions: ['Ensure the document is clear and readable'],
            details: {},
          });
          return;
        }

        // Set canvas size (sample a portion for performance)
        const sampleSize = Math.min(500, img.width, img.height);
        canvas.width = sampleSize;
        canvas.height = sampleSize;

        // Draw image
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        try {
          const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
          const data = imageData.data;

          // Calculate brightness and contrast
          let totalBrightness = 0;
          let brightnessValues: number[] = [];

          for (let i = 0; i < data.length; i += 4) {
            const brightness = ((data[i] || 0) + (data[i + 1] || 0) + (data[i + 2] || 0)) / 3;
            totalBrightness += brightness;
            brightnessValues.push(brightness);
          }

          const avgBrightness = brightnessValues.length > 0 ? totalBrightness / brightnessValues.length : 0;

          // Calculate contrast (standard deviation of brightness)
          let variance = 0;
          for (const brightness of brightnessValues) {
            variance += Math.pow(brightness - avgBrightness, 2);
          }
          const contrast = Math.sqrt(variance / brightnessValues.length);

          // Calculate sharpness using Laplacian variance
          let sharpness = 0;
          for (let y = 1; y < sampleSize - 1; y++) {
            for (let x = 1; x < sampleSize - 1; x++) {
              const idx = (y * sampleSize + x) * 4;
              const center = data[idx] || 0;
              const top = data[((y - 1) * sampleSize + x) * 4] || 0;
              const bottom = data[((y + 1) * sampleSize + x) * 4] || 0;
              const left = data[(y * sampleSize + (x - 1)) * 4] || 0;
              const right = data[(y * sampleSize + (x + 1)) * 4] || 0;

              const laplacian = Math.abs(4 * center - top - bottom - left - right);
              sharpness += laplacian;
            }
          }
          sharpness = (sampleSize - 2) * (sampleSize - 2) > 0 ? sharpness / ((sampleSize - 2) * (sampleSize - 2)) : 0;

          // Quality scoring
          const warnings: string[] = [];
          const suggestions: string[] = [];
          let score = 100;

          // Resolution check
          const minResolution = 800;
          if (img.width < minResolution || img.height < minResolution) {
            warnings.push(`Low resolution: ${img.width}x${img.height}px`);
            suggestions.push('Use a higher resolution image (min 800x800px)');
            score -= 20;
          }

          // Brightness check (ideal range: 100-180)
          if (avgBrightness < 80) {
            warnings.push('Image is too dark');
            suggestions.push('Retake photo in better lighting conditions');
            score -= 15;
          } else if (avgBrightness > 200) {
            warnings.push('Image is overexposed');
            suggestions.push('Reduce lighting or adjust camera exposure');
            score -= 15;
          } else if (avgBrightness < 100 || avgBrightness > 180) {
            warnings.push('Image brightness is suboptimal');
            suggestions.push('Adjust lighting for better visibility');
            score -= 10;
          }

          // Contrast check (ideal: > 30)
          if (contrast < 20) {
            warnings.push('Low contrast - text may be hard to read');
            suggestions.push('Ensure good lighting and avoid shadows');
            score -= 15;
          } else if (contrast < 30) {
            warnings.push('Moderate contrast - could be improved');
            score -= 5;
          }

          // Sharpness check (ideal: > 10)
          if (sharpness < 5) {
            warnings.push('Image is blurry');
            suggestions.push('Hold camera steady and ensure proper focus');
            score -= 20;
          } else if (sharpness < 10) {
            warnings.push('Image could be sharper');
            suggestions.push('Ensure camera is focused on the document');
            score -= 10;
          }

          // File size check
          const fileSizeMB = file.size / (1024 * 1024);
          if (fileSizeMB < 0.05) {
            warnings.push('File size is very small - may indicate compression issues');
            score -= 10;
          }

          const passed = score >= 60; // Passing threshold

          resolve({
            passed,
            score: Math.max(0, score),
            warnings,
            suggestions,
            details: {
              resolution: { width: img.width, height: img.height },
              fileSize: file.size,
              brightness: Math.round(avgBrightness),
              contrast: Math.round(contrast),
              sharpness: Math.round(sharpness * 10) / 10,
            },
          });
        } catch (error) {
          console.error('Quality analysis error:', error);
          resolve({
            passed: true,
            score: 50,
            warnings: ['Could not fully analyze image quality'],
            suggestions: ['Manually verify the document is clear and readable'],
            details: {
              resolution: { width: img.width, height: img.height },
              fileSize: file.size,
            },
          });
        }
      };

      img.onerror = () => {
        resolve({
          passed: false,
          score: 0,
          warnings: ['Failed to load image'],
          suggestions: ['Try a different file format or re-scan the document'],
          details: {},
        });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve({
        passed: false,
        score: 0,
        warnings: ['Failed to read file'],
        suggestions: ['Try uploading the file again'],
        details: {},
      });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validate document quality based on file type
 */
export async function validateDocumentQuality(file: File): Promise<QualityCheckResult> {
  // Only perform quality checks on images
  if (file.type.startsWith('image/')) {
    return checkImageQuality(file);
  }

  // For PDFs and other documents, perform basic checks
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  const fileSizeMB = file.size / (1024 * 1024);

  // Very small files might be incomplete
  if (fileSizeMB < 0.02) {
    warnings.push('File size is unusually small');
    suggestions.push('Ensure the document is complete and not corrupted');
    score -= 20;
  }

  // Very large files might have issues
  if (fileSizeMB > 8) {
    warnings.push('File size is quite large');
    suggestions.push('Consider compressing the file if possible');
    score -= 10;
  }

  return {
    passed: score >= 60,
    score,
    warnings,
    suggestions,
    details: {
      fileSize: file.size,
    },
  };
}

/**
 * Get a human-readable quality description
 */
export function getQualityLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: 'text-green-600' };
  if (score >= 75) return { label: 'Good', color: 'text-blue-600' };
  if (score >= 60) return { label: 'Acceptable', color: 'text-yellow-600' };
  if (score >= 40) return { label: 'Poor', color: 'text-orange-600' };
  return { label: 'Very Poor', color: 'text-red-600' };
}
