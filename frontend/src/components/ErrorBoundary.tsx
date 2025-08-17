import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800">
                Something went wrong
              </h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-700">
              An error occurred while rendering this component. This might be
              due to:
            </p>
            <ul className="list-disc list-inside text-red-600 space-y-1 text-sm">
              <li>Network connectivity issues</li>
              <li>Server errors (500 Internal Server Error)</li>
              <li>Invalid data format</li>
              <li>Missing authentication</li>
            </ul>
            {this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-red-700 font-medium">
                  View Error Details
                </summary>
                <pre className="mt-2 text-xs bg-red-100 p-3 rounded border overflow-auto text-red-800">
                  {this.state.error.message}
                  {this.state.error.stack && "\n\n" + this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="flex space-x-2">
              <Button
                onClick={this.handleRetry}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
