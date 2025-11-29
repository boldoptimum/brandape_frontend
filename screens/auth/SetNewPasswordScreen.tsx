import React, { useState } from 'react';
import { AppView } from '../../types/index';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useAppContext } from '../../hooks/useAppContext';

const SetNewPasswordScreen: React.FC = () => {
    const { navigateTo, handleSetNewPassword } = useAppContext();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }
        if (password && password === confirmPassword) {
            handleSetNewPassword(password);
        } else {
            alert("Passwords do not match.");
        }
    };

    return (
    <AuthLayout onNavigateHome={() => navigateTo(AppView.HOME)}>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Set New Password</h1>
        <p className="mt-2 text-sm text-slate-600">Must be at least 6 characters</p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 text-left">New Password</label>
          <input 
            id="new-password" 
            name="new-password" 
            type={showPassword ? "text" : "password"} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" 
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 font-semibold text-slate-600">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        
        <div className="relative">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 text-left">Confirm New Password</label>
          <input 
            id="confirm-password" 
            name="confirm-password" 
            type={showConfirmPassword ? "text" : "password"} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" 
            placeholder="Enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 font-semibold text-slate-600">
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
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

export default SetNewPasswordScreen;