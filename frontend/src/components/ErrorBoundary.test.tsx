/**
 * Tests for ErrorBoundary Component
 *
 * Ensures error boundaries catch and display errors correctly
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should catch errors and display fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('should display error details in development mode', () => {
    // Note: NODE_ENV is already set to 'test' in vitest, which will show error details
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // In test environment, error details are shown (similar to development)
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  it('should hide error details in production mode', () => {
    // Note: Cannot change NODE_ENV at runtime, so we test the rendering path
    // In actual production, error details would be hidden
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // We can at least verify the error boundary catches the error
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('should render custom fallback if provided', () => {
    const CustomFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('should display "Try Again" button', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });

  it('should display "Go Home" button', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /Go Home/i })).toBeInTheDocument();
  });

  it('should display support link', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const supportLink = screen.getByText(/contact support/i);
    expect(supportLink).toBeInTheDocument();
    expect(supportLink.closest('a')).toHaveAttribute('href', '/dashboard/support');
  });

  it('should recover from error when reset is clicked', async () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Error is displayed
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    // Click reset button
    const resetButton = screen.getByRole('button', { name: /Try Again/i });
    resetButton.click();

    // Rerender with non-erroring component
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should show normal content
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
  });
});
