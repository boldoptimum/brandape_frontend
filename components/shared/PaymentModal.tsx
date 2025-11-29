
import React, { useState, useEffect } from 'react';
import BrandApeLogo from '../icons/BrandApeLogo';

interface PaymentModalProps {
  isOpen: boolean;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, amount, onClose, onSuccess }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    if (!isOpen) {
        // Reset state when closed
        setTimeout(() => setStep('details'), 500);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    // Simulate API call time
    setTimeout(() => {
        setStep('success');
        // Close after success animation
        setTimeout(() => {
            onSuccess();
        }, 2000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
            <BrandApeLogo className="h-6 text-emerald-600" />
            <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
        </div>

        <div className="p-8">
            {step === 'details' && (
                <form onSubmit={handlePay} className="space-y-5">
                    <div className="text-center mb-6">
                        <p className="text-gray-500 text-sm">Total Amount</p>
                        <h2 className="text-3xl font-bold text-slate-800">N {amount.toLocaleString()}</h2>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="0000 0000 0000 0000" 
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value.replace(/\D/g,'').substring(0,16))}
                                required
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry</label>
                            <input 
                                type="text" 
                                placeholder="MM/YY" 
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                value={expiry}
                                onChange={e => setExpiry(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CVC</label>
                            <input 
                                type="text" 
                                placeholder="123" 
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                value={cvc}
                                onChange={e => setCvc(e.target.value.substring(0,3))}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition hover:-translate-y-0.5">
                        Pay Securely
                    </button>
                    
                    <div className="flex justify-center space-x-2 text-xs text-gray-400 mt-4">
                        <span>🔒 256-bit SSL Encrypted</span>
                        <span>•</span>
                        <span>Powered by BrandApe Pay</span>
                    </div>
                </form>
            )}

            {step === 'processing' && (
                <div className="text-center py-10">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Processing Payment</h3>
                    <p className="text-gray-500">Please do not close this window...</p>
                    <p className="text-xs text-emerald-600 mt-4 animate-pulse">Contacting Bank...</p>
                </div>
            )}

            {step === 'success' && (
                <div className="text-center py-10">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
                    <p className="text-gray-500">Redirecting you...</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
