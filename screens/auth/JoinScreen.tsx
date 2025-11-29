import React from 'react';
import { AppView, UserType } from '../../types/index';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Images } from '../../assets/images';
import { useAppContext } from '../../hooks/useAppContext';

const BuyerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const VendorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H4.5A2.25 2.25 0 002.25 13.5V21" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18M5.25 3v18m13.5-18v18M9 6.75h6.375a1.125 1.125 0 011.125 1.125v1.125a1.125 1.125 0 01-1.125 1.125H9" />
    </svg>
);


const JoinScreen: React.FC = () => {
    const { navigateTo, setJoiningUserType } = useAppContext();
    
    const handleSelect = (type: UserType, view: AppView) => {
        setJoiningUserType(type);
        navigateTo(view);
    };

  return (
    <AuthLayout onNavigateHome={() => navigateTo(AppView.HOME)}>
      <div className="text-right mb-8">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <button onClick={() => navigateTo(AppView.LOGIN)} className="font-semibold text-emerald-600 hover:text-emerald-800">
            Sign In
          </button>
        </p>
      </div>
      <div className="text-left">
        <h1 className="text-3xl font-bold text-slate-900">Join Us!</h1>
        <p className="mt-2 text-slate-600">To begin this journey, tell us what type of account you’d be opening.</p>

        <div className="mt-8 space-y-4">
          <button 
            onClick={() => handleSelect(UserType.BUYER, AppView.REGISTER_INDIVIDUAL)}
            className="w-full flex items-center p-4 border border-slate-300 rounded text-left hover:border-emerald-500 hover:bg-emerald-50 transition-colors ring-2 ring-transparent focus:ring-emerald-500 outline-none"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded mr-4">
              <BuyerIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Individual</h2>
              <p className="text-sm text-slate-500">Personal account to manage all you activities.</p>
            </div>
          </button>
          
          <button 
            onClick={() => handleSelect(UserType.VENDOR, AppView.REGISTER_VENDOR)}
            className="w-full flex items-center p-4 border border-slate-300 rounded text-left hover:border-emerald-500 hover:bg-emerald-50 transition-colors ring-2 ring-transparent focus:ring-emerald-500 outline-none"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded mr-4">
              <VendorIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Vendor</h2>
              <p className="text-sm text-slate-500">Own or belong to a company, this is for you.</p>
            </div>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default JoinScreen;