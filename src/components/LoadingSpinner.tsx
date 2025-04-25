import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-primary-500"></div>
    </div>
  );
};

export default LoadingSpinner;