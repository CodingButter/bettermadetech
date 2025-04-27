'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Import the SpinnerDemo component with dynamic import to prevent SSR issues
// since it uses browser APIs like localStorage
const SpinnerDemo = dynamic(() => import('./spinner-demo').then(mod => mod.SpinnerDemo), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Spinner Demo...</div>
});

export const SpinnerContainer: React.FC = () => {
  return <SpinnerDemo />;
}