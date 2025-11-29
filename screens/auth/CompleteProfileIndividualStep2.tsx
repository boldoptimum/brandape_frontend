import React from 'react';
import { AppView } from '../../types/index';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useAppContext } from '../../hooks/useAppContext';

const CompleteProfileIndividualStep2: React.FC = () => {
  const { navigateTo } = useAppContext();
  
  return (
    <AuthLayout onNavigateHome={() => navigateTo(AppView.HOME)}>
      <div className="flex justify-between items-start mb-6">
        <button onClick={() => navigateTo(AppView.VERIFY_EMAIL)} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
        <div className="text-right">
          <p className="text-xs text-slate-500">STEP 02/03</p>
          <p className="text-sm font-semibold text-slate-700">Residency Info.</p>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-slate-900">Complete Your Profile!</h1>
      <p className="mt-2 text-sm text-slate-600">For the purpose of industry regulation, your details are required.</p>

      <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); navigateTo(AppView.COMPLETE_PROFILE_INDIVIDUAL_STEP3); }}>
        <div>
          <label className="block text-sm font-medium text-slate-700">Phone number</label>
          <div className="mt-1 flex rounded shadow-sm">
             <select className="inline-flex items-center px-3 rounded-l border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                <option>🇳🇬 +234</option>
             </select>
            <input type="text" className="-ml-px relative block w-full rounded-none rounded-r bg-white border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" defaultValue="090912345567" />
          </div>
        </div>
        
        <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700">Your address</label>
            <input id="address" type="text" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" placeholder="Please enter address"/>
        </div>

        <div>
            <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country of residence</label>
            <select id="country" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded bg-white">
                <option>Please select</option>
                <option>Nigeria</option>
                <option>Ghana</option>
                <option>Kenya</option>
            </select>
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

export default CompleteProfileIndividualStep2;