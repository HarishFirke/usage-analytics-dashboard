import React from "react";
import { Card, CardContent } from "../../shared/ui/card";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ErrorDisplay;
