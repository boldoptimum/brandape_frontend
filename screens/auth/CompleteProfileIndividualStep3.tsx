import React from 'react';
import { AppView } from '../../types/index';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useAppContext } from '../../hooks/useAppContext';

const CompleteProfileIndividualStep3: React.FC = () => {
  const { navigateTo, finishOnboarding } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, user name would come from state managed across steps
    finishOnboarding("Invictus Innocent");
  }

  return (
    <AuthLayout onNavigateHome={() => navigateTo(AppView.HOME)}>
      <div className="flex justify-between items-start mb-6">
        <button onClick={() => navigateTo(AppView.COMPLETE_PROFILE_INDIVIDUAL_STEP2)} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
        <div className="text-right">
          <p className="text-xs text-slate-500">STEP 03/03</p>
          <p className="text-sm font-semibold text-slate-700">Bank Verification</p>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-slate-900">Complete Your Profile!</h1>
      <p className="mt-2 text-sm text-slate-600">For the purpose of industry regulation, your details are required.</p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <label htmlFor="bvn" className="block text-sm font-medium text-slate-700">Bank verification number (BVN)</label>
          <input id="bvn" type="text" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm pr-10 bg-white" defaultValue="090912345567"/>
          <div className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="text-center pt-2">
            <button type="submit" className="w-full justify-center py-3 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            Save & Continue
            </button>
            <p className="mt-4 text-xs text-slate-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                Your info is safely secured
            </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default CompleteProfileIndividualStep3;