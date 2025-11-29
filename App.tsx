
import React from 'react';
import AppRouter from './router/AppRouter';
import GlobalSpinner from './components/common/GlobalSpinner';
import Toast from './components/common/Toast';
import { useAppContext } from './hooks/useAppContext';
import ConfirmationModals from './components/common/ConfirmationModals';

const App: React.FC = () => {
  const { isLoading, toast, setToast, criticalError, loadInitialData, homepageContent } = useAppContext();

  React.useEffect(() => {
      if (homepageContent?.branding?.favicon) {
          const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (link) {
              link.href = homepageContent.branding.favicon;
          } else {
              const newLink = document.createElement('link');
              newLink.rel = 'icon';
              newLink.href = homepageContent.branding.favicon;
              document.head.appendChild(newLink);
          }
      }
  }, [homepageContent]);

  if (criticalError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
        <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600">Application Error</h1>
          <p className="mt-4 text-slate-700">{criticalError}</p>
          <button
            onClick={loadInitialData}
            className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalSpinner isLoading={isLoading} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmationModals />
      <AppRouter />
    </>
  );
};

export default App;
