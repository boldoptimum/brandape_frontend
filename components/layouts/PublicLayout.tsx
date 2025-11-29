import React, { useState } from 'react';
import { AppView, UserType } from '../../types/index';
import BrandApeLogo from '../icons/BrandApeLogo';
import { useAppContext } from '../../hooks/useAppContext';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { navigateTo, isLoggedIn, currentUser, handleLogout, cartCount, setSearchQuery } = useAppContext();
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const handleAccountClick = () => {
    if (!currentUser) {
      navigateTo(AppView.LOGIN);
      return;
    }
    switch (currentUser.type) {
      case UserType.VENDOR:
        navigateTo(AppView.VENDOR_DASHBOARD);
        break;
      case UserType.BUYER:
        navigateTo(AppView.BUYER_DASHBOARD);
        break;
      case UserType.SUPPORT_AGENT:
        navigateTo(AppView.SUPPORT_DASHBOARD);
        break;
      case UserType.SUPER_ADMIN:
        navigateTo(AppView.ADMIN_DASHBOARD);
        break;
      default:
        navigateTo(AppView.LOGIN);
    }
  }
  
  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSearchQuery(localSearchQuery);
      navigateTo(AppView.HOME);
  };
  
  const handleCartClick = () => {
    navigateTo(AppView.CART);
  };

  return (
    <div className="bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center py-2 text-xs text-slate-600 space-y-1 sm:space-y-0">
                <div className="flex items-center space-x-4">
                    <span>📞 +234 808 7655 765</span>
                </div>
                <div className="hidden sm:block">Get 50% off on selected items</div>
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="font-medium hover:text-emerald-600">Logout</button>
                    ) : (
                        <>
                            <button onClick={() => navigateTo(AppView.LOGIN)} className="font-medium hover:text-emerald-600">Login</button>
                            <span>/</span>
                            <button onClick={() => navigateTo(AppView.JOIN)} className="font-medium hover:text-emerald-600">Register</button>
                        </>
                    )}
                </div>
            </div>
        </div>
        <div className="container mx-auto px-4 flex justify-between items-center py-4">
            <button onClick={() => navigateTo(AppView.HOME)}>
                <BrandApeLogo className="h-6 w-auto text-black" />
            </button>
            <div className="flex-1 max-w-xl mx-4 sm:mx-8">
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input 
                        type="text" 
                        placeholder="I am looking for..." 
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
                    <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                       <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </form>
            </div>
            <div className="flex items-center space-x-4 md:space-x-6">
                <button onClick={handleAccountClick} className="flex items-center space-x-2 text-gray-700">
                   <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    <span className="hidden sm:inline">{isLoggedIn ? "Account" : "Login"}</span>
                </button>
                <button onClick={handleCartClick} className="relative flex items-center space-x-2 text-gray-700">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.837a.5.5 0 00-.476-.665H5.402M4.5 7.5h15M7.5 14.25a3 3 0 000 6h12" /></svg>
                    <span className="hidden sm:inline">Cart</span>
                    {cartCount > 0 && 
                        <span className="absolute -top-2 -right-2 w-5 h-5 text-xs bg-emerald-600 text-white rounded-full flex items-center justify-center">{cartCount}</span>
                    }
                </button>
            </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 mt-6">
        {children}
      </main>

      <footer className="bg-slate-800 text-slate-300 pt-16 pb-8 mt-12">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-2 pr-8">
                    <BrandApeLogo className="h-6 w-auto text-white" />
                    <p className="mt-4 text-sm text-slate-400">Lorem ipsum dolor sit amet consectetur. Eget nunc eu quisque est. Id nisl, ullamcorper ut, suspendisse tempor eget. </p>
                    <div className="mt-6">
                        <h4 className="font-semibold text-slate-200 text-sm">Accepted Payments</h4>
                        <div className="flex space-x-2 mt-2">
                           <div className="bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600 text-xs">Visa</div>
                           <div className="bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600 text-xs">Mastercard</div>
                           <div className="bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600 text-xs">Apple Pay</div>
                        </div>
                    </div>
                     <div className="mt-6 flex space-x-2">
                        <button className="bg-black text-white px-3 py-2 rounded-lg text-xs">Download on the App Store</button>
                        <button className="bg-black text-white px-3 py-2 rounded-lg text-xs">GET IT ON Google Play</button>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-white">Find product</h4>
                    <ul className="mt-4 space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-emerald-400">Brownie arnold</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Goldcrest value</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Smart phones</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Automatic watch</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Hair straighteners</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white">Get help</h4>
                    <ul className="mt-4 space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-emerald-400">About us</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Contact us</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Return policy</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Privacy policy</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Payment policy</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold text-white">About us</h4>
                    <ul className="mt-4 space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-emerald-400">News</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Service</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Our policy</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Customer care</a></li>
                        <li><a href="#" className="hover:text-emerald-400">Faqs</a></li>
                    </ul>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
