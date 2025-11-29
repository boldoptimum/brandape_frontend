import React, { useState } from 'react';
import { AppView, UserType } from '../../types/index';
import AuthLayout from '../../components/layouts/AuthLayout';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import { useAppContext } from '../../hooks/useAppContext';

const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.655-3.417-11.297-7.914l-6.573,4.817C9.866,39.999,16.489,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.986,36.657,44,30.851,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

const RegisterScreen: React.FC = () => {
  const { navigateTo, handleRegister, joiningUserType } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const title = joiningUserType === UserType.VENDOR ? "Register vendor Account!" : "Register Individual Account!";
  const subTitle = "For the purpose of industry regulation, your details are required.";
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleRegister(email, password, fullname, joiningUserType);
  }

  return (
    <AuthLayout onNavigateHome={() => navigateTo(AppView.HOME)}>
      <div className="flex justify-between items-start mb-6">
        <button onClick={() => navigateTo(AppView.JOIN)} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="text-right">
          <p className="text-xs text-slate-500">STEP 01/03</p>
          <p className="text-sm font-semibold text-slate-700">Personal Info.</p>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{subTitle}</p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullname" className="block text-sm font-medium text-slate-700">Your fullname*</label>
          <input id="fullname" name="fullname" type="text" autoComplete="name" required 
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" 
            placeholder="Invictus Innocent"
            value={fullname}
            onChange={e => setFullname(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address*</label>
          <input id="email" name="email" type="email" autoComplete="email" required 
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" 
            placeholder="Enter email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">Create password*</label>
          <input id="password" name="password" type={showPassword ? "text" : "password"} required 
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white" 
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 font-semibold text-slate-600">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        
        <div className="flex items-center">
            <input id="terms" name="terms" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded" defaultChecked/>
            <label htmlFor="terms" className="ml-2 block text-sm text-slate-900">I agree to terms & conditions</label>
        </div>

        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
          Register Account
        </button>
        
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or</span>
            </div>
        </div>

        <button type="button" className="w-full flex items-center justify-center py-3 px-4 border border-slate-300 rounded shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
            <GoogleIcon className="mr-2"/>
            Register with Google
        </button>
      </form>
    </AuthLayout>
  );
};

export default RegisterScreen;