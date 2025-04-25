import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Home } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <BookOpen className="h-16 w-16 text-primary-500 mx-auto mb-4" />
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-black dark:text-white bg-primary-500 hover:bg-primary-600 transition-colors"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
