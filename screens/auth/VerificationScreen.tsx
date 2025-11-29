import React, { useState, useEffect, useRef } from 'react';
import { AppView, UserType } from '../../types/index';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useAppContext } from '../../hooks/useAppContext';

const VerificationScreen: React.FC = () => {
  const { navigateTo, joiningUserType, registrationEmail, completeRegistration } = useAppContext();
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [timer, setTimer] = useState(5);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleProceed = () => {
    // In a real app, you would verify the OTP here
    completeRegistration();
  }

  const handleBack = () => {
    const backView = joiningUserType === UserType.VENDOR ? AppView.REGISTER_VENDOR : AppView.REGISTER_INDIVIDUAL;
    navigateTo(backView);
  }

  return (
    <AuthLayout onNavigateHome={() => navigateTo(AppView.HOME)}>
      <div className="flex justify-between items-start mb-6">
        <button onClick={handleBack} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
        <div className="text-right">
          <p className="text-xs text-slate-500">STEP 01/03</p>
          <p className="text-sm font-semibold text-slate-700">Personal Info.</p>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Verification Code</h1>
        <p className="mt-2 text-slate-600">
          We have sent a verification code to <span className="font-bold text-slate-800">{registrationEmail}</span>.
        </p>

        <div className="flex justify-center gap-2 sm:gap-4 my-8">
          {otp.map((data, index) => {
            return (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength={1}
                className="w-14 h-14 text-center text-2xl font-semibold border border-slate-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
                value={data}
                onChange={e => handleChange(e.target, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                onFocus={e => e.target.select()}
                ref={el => { inputRefs.current[index] = el; }}
              />
            );
          })}
        </div>

        <button 
          onClick={handleProceed}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Proceed
        </button>

        <div className="mt-6 text-sm text-slate-600">
          {timer > 0 ? (
            <p>Resend code in <span className="font-bold text-slate-800">{timer}s</span></p>
          ) : (
            <p>
              Didn't receive code?{' '}
              <button onClick={() => setTimer(59)} className="font-semibold text-emerald-600 hover:text-emerald-800">
                Resend
              </button>
            </p>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerificationScreen;
