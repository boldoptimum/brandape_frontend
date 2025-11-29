import React from 'react';
import BrandApeLogo from '../icons/BrandApeLogo';
import { Images } from '../../assets/images';


interface AuthLayoutProps {
  children: React.ReactNode;
  imageUrl?: string;
  onNavigateHome: () => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, imageUrl = Images.backgrounds.authBg, onNavigateHome }) => {
  const bgStyle = {
    backgroundImage: `url(${imageUrl})`,
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Image Panel */}
      <aside className="hidden lg:block lg:w-1/2 bg-cover bg-center relative" style={bgStyle}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-900 opacity-90"></div>
        <div className="relative p-12 flex flex-col h-full text-white">
            <button onClick={onNavigateHome} aria-label="Back to home">
                <BrandApeLogo className="h-7 text-white" />
            </button>
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold leading-tight">
                        Unlock Global Trade.
                    </h1>
                    <p className="mt-4 text-lg text-slate-300 max-w-sm mx-auto">
                        Your gateway to a world of quality farm produce, secured and delivered.
                    </p>
                </div>
            </div>
            <div className="flex-shrink-0">
                <blockquote className="border-l-4 border-emerald-500 pl-4">
                    <p className="text-slate-200">
                        "BrandApe has revolutionized how we connect with international buyers. The escrow service provides peace of mind for every transaction."
                    </p>
                    <footer className="mt-2 text-sm text-slate-400">
                        — Fatima Ahmed, CEO of Agro Supplies
                    </footer>
                </blockquote>
            </div>
        </div>
      </aside>

      {/* Right Form Panel */}
      <main className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-md w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
