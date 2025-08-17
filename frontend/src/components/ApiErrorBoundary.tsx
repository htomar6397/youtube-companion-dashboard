import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
  onRetry?: () => void;
}

const ApiErrorBoundary: React.FC<ApiErrorBoundaryProps> = ({
  children,
  componentName = "Component",
  onRetry,
}) => {
  const fallback = (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-orange-800">
            {componentName} temporarily unavailable
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-orange-700">
          <p className="mb-3">
            This section is experiencing issues. Possible causes:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              <strong>Server Error (500):</strong> Backend service is down or
              misconfigured
            </li>
            <li>
              <strong>Network Issues:</strong> Connection to the API server
              failed
            </li>
            <li>
              <strong>Authentication:</strong> Your session may have expired
            </li>
            <li>
              <strong>Rate Limiting:</strong> Too many requests to YouTube API
            </li>
          </ul>
        </div>

        <div className="bg-orange-100 p-3 rounded border text-sm text-orange-800">
          <strong>Troubleshooting:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Check your internet connection</li>
            <li>Verify the backend server is running</li>
            <li>Try refreshing the page</li>
            <li>Check browser console for detailed errors</li>
          </ol>
        </div>

        <div className="flex space-x-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              Retry {componentName}
            </Button>
          )}
          <Button
            onClick={() => window.location.reload()}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
};

export default ApiErrorBoundary;
