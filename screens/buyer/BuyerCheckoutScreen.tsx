
import React, { useState } from 'react';
import { AppView } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';
import PaymentModal from '../../components/shared/PaymentModal';

const BuyerCheckoutScreen: React.FC = () => {
  const { currentUser, cart, handlePlaceOrder, navigateTo } = useAppContext();
  const [step, setStep] = useState(1);
  const [useEscrow, setUseEscrow] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  if (!currentUser) return null; // Should not happen in this view
  
  const isKycVerified = currentUser.kycStatus === 'Verified';
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal + 5000;

  const handleInitiatePayment = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
      setIsPaymentModalOpen(false);
      handlePlaceOrder(useEscrow);
      setStep(3); // Move to confirmation step
  };

  const renderStep = () => {
    switch(step) {
        case 1: // Shipping
            return (
                <div className="animate-fade-in">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">Shipping Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" defaultValue={currentUser.name} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white focus:ring-emerald-500" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Address</label>
                            <input type="text" placeholder="123 Main St" defaultValue={currentUser.address.street} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white focus:ring-emerald-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-700">City</label>
                                <input type="text" defaultValue={currentUser.address.city} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white focus:ring-emerald-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Country</label>
                                <input type="text" defaultValue={currentUser.address.country} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white focus:ring-emerald-500" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button onClick={() => setStep(2)} className="px-6 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 transition-colors">Continue to Payment</button>
                        </div>
                    </div>
                </div>
            );
        case 2: // Payment
            return (
                 <div className="animate-fade-in">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800">Payment & Order Summary</h3>
                     <div className="mt-4 p-6 border rounded-lg bg-slate-50 space-y-3">
                        <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span> <span>N {subtotal.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm text-slate-600"><span>Shipping</span> <span>N 5,000</span></div>
                        <div className="flex justify-between font-bold border-t border-slate-200 pt-3 text-lg text-slate-800"><span>Total</span> <span>N {totalAmount.toLocaleString()}</span></div>
                    </div>

                    <div className="mt-6 p-4 border-2 border-emerald-500 bg-emerald-50 rounded-lg cursor-pointer transition-colors">
                        <div className="flex items-start">
                            <input 
                                id="escrow" 
                                name="escrow" 
                                type="checkbox" 
                                checked={useEscrow}
                                onChange={(e) => setUseEscrow(e.target.checked)}
                                className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded mt-1" 
                            />
                            <div className="ml-3">
                                <label htmlFor="escrow" className="font-bold text-slate-900 block">Use Escrow Protection</label>
                                <p className="text-sm text-slate-600 mt-1">Your payment is held securely in a trust account. Funds are only released to the vendor after you verify and confirm the delivery of your goods.</p>
                            </div>
                        </div>
                    </div>

                    {!isKycVerified && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-center text-sm text-yellow-800 flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            You must <button onClick={() => navigateTo(AppView.KYC_SUBMISSION)} className="font-bold underline ml-1">verify your account (KYC)</button> to proceed.
                        </div>
                    )}
                    
                    <div className="flex justify-between mt-8">
                         <button onClick={() => setStep(1)} className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium">Back</button>
                        <button 
                            onClick={handleInitiatePayment} 
                            disabled={!isKycVerified}
                            className="px-8 py-3 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all"
                        >
                            Pay N {totalAmount.toLocaleString()}
                        </button>
                    </div>
                </div>
            );
        case 3: // Confirmation
            return (
                <div className="text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold mt-4 text-slate-800">Order Placed Successfully!</h3>
                    <p className="text-slate-600 mt-2">Thank you for your purchase. You can track your order status in the dashboard.</p>
                    <button
                        onClick={() => navigateTo(AppView.BUYER_DASHBOARD)}
                        className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 font-medium transition-colors"
                    >
                        Go to My Orders
                    </button>
                </div>
            );
        default:
            return null;
    }
  }

  return (
    <DashboardLayout>
        <PaymentModal 
            isOpen={isPaymentModalOpen} 
            amount={totalAmount} 
            onClose={() => setIsPaymentModalOpen(false)} 
            onSuccess={handlePaymentSuccess} 
        />
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto border border-slate-100">
            <div className="flex justify-between mb-8 border-b pb-4">
                <div className={`flex items-center ${step >= 1 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${step >= 1 ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>1</span>
                    <span className="ml-2 font-medium hidden sm:block">Shipping</span>
                </div>
                 <div className={`flex-1 h-0.5 self-center mx-4 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                <div className={`flex items-center ${step >= 2 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${step >= 2 ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>2</span>
                    <span className="ml-2 font-medium hidden sm:block">Payment</span>
                </div>
                 <div className={`flex-1 h-0.5 self-center mx-4 ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                <div className={`flex items-center ${step >= 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${step >= 3 ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>3</span>
                    <span className="ml-2 font-medium hidden sm:block">Complete</span>
                </div>
            </div>
            {renderStep()}
        </div>
    </DashboardLayout>
  );
};

export default BuyerCheckoutScreen;
