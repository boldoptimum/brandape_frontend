import React from 'react';
import { AppView } from '../types/index';
import { useAppContext } from '../hooks/useAppContext';

const NotFoundScreen: React.FC = () => {
  const { navigateTo } = useAppContext();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-emerald-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Page not found</h2>
        <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
        <div className="mt-10">
          <button
            onClick={() => navigateTo(AppView.HOME)}
            className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Go back home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundScreen;