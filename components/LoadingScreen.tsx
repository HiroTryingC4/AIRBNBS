'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center transition-opacity duration-500">
      <div className="text-center">
        {/* Animated Logo/Brand */}
        <div className="mb-8 animate-pulse">
          <h1 className="text-6xl font-bold text-white mb-2">Evangelina's Staycation</h1>
          <p className="text-brand-100 text-lg">Urban Deca Towers Cubao, Quezon City</p>
        </div>

        {/* Spinner Animation */}
        <div className="flex justify-center items-center space-x-2">
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Loading Text */}
        <p className="text-white mt-6 text-sm animate-pulse">Loading your experience...</p>
      </div>
    </div>
  );
}
