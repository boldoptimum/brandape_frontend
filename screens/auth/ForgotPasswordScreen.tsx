import React, { useState } from 'react';
import { AppView } from '../../types/index';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useAppContext } from '../../hooks/useAppContext';

const ForgotPasswordScreen: React.FC = () => {
  const { navigateTo, handleForgotPassword } = useAppContext();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      handleForgotPassword(email);
    }
  };

  return (
    <AuthLayout onNavigateHome={() => navigateTo(AppView.HOME)}>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Forgot Password?</h1>
        <p className="mt-2 text-sm text-slate-600">No worries, we will send reset instructions</p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 text-left">Email address*</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            autoComplete="email" 
            required 
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" 
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
          Reset Password
        </button>

        <div className="text-center">
          <button type="button" onClick={() => navigateTo(AppView.LOGIN)} className="font-medium text-sm text-slate-600 hover:text-slate-900">Back to Login</button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;