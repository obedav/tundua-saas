"use client";

import { Component, ReactNode, ErrorInfo } from "react";
import { Alert, Button } from "@/components/ui";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service
    console.error("Error Boundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-slate-50 via-white to-slate-50">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Oops! Something went wrong
              </h1>
              <p className="text-lg text-gray-600">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>

            {/* Error Details Card */}
            <div className="bg-white rounded-2xl shadow-elevation-3 border border-gray-100 p-8 mb-6">
              <Alert variant="danger" className="mb-6">
                <strong className="block mb-1">Error Details:</strong>
                <code className="text-sm block">
                  {this.state.error?.toString()}
                </code>
              </Alert>

              {/* Stack Trace - Only in development */}
              {process.env.NODE_ENV === "development" && this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
                    View Stack Trace
                  </summary>
                  <pre className="mt-3 p-4 bg-gray-50 rounded-lg text-xs overflow-auto max-h-64 border border-gray-200">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={this.handleReset}
                leftIcon={<RefreshCw className="w-5 h-5" />}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => (window.location.href = "/")}
                leftIcon={<Home className="w-5 h-5" />}
              >
                Go to Homepage
              </Button>
            </div>

            {/* Support Link */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                If this problem persists, please{" "}
                <a
                  href="/support"
                  className="text-primary-600 hover:text-primary-700 font-semibold underline"
                >
                  contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
