
import React, { useState } from 'react';
import { AppView } from '../../types/index';
import PublicLayout from '../../components/layouts/PublicLayout';
import { useAppContext } from '../../hooks/useAppContext';

const BuyerCartScreen: React.FC = () => {
  const { cart, handleUpdateCartQuantity, handleRemoveFromCart, navigateTo, isLoggedIn, setPostLoginAction, promotions } = useAppContext();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{code: string, discountAmount: number, details?: string} | null>(null);
  const [promoError, setPromoError] = useState('');

  // Calculate standard subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5000;
  
  const handleApplyPromo = () => {
      setPromoError('');
      setAppliedPromo(null);
      
      const promo = promotions.find(p => p.code === promoCode.toUpperCase() && p.status === 'Active');
      
      if (!promo) {
          setPromoError('Invalid promotion code.');
          return;
      }
      
      // Check expiry
      if (new Date(promo.expiryDate) < new Date()) {
          setPromoError('This promotion code has expired.');
          return;
      }

      // Check usage limit
      if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
          setPromoError('This promotion code has reached its usage limit.');
          return;
      }

      // Filter eligible items based on all criteria
      const eligibleItems = cart.filter(item => {
          // 1. Check Category
          const isCategoryValid = !promo.applicableCategories || promo.applicableCategories.length === 0 || promo.applicableCategories.includes(item.category);
          
          // 2. Check Subcategory
          const isSubcategoryValid = !promo.applicableSubcategories || promo.applicableSubcategories.length === 0 || (item.subcategory && promo.applicableSubcategories.includes(item.subcategory));
          
          // 3. Check Vendor
          const isVendorValid = !promo.applicableVendors || promo.applicableVendors.length === 0 || promo.applicableVendors.includes(item.vendorId);

          // 4. Check Specific Products
          const isProductValid = !promo.applicableProductIds || promo.applicableProductIds.length === 0 || promo.applicableProductIds.includes(item.id);

          return isCategoryValid && isSubcategoryValid && isVendorValid && isProductValid;
      });

      if (eligibleItems.length === 0) {
          setPromoError(`This code does not apply to any items in your cart.`);
          return;
      }

      const eligibleAmount = eligibleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let discount = 0;

      if (promo.type === 'percentage') {
          discount = (eligibleAmount * promo.value) / 100;
      } else {
          // For fixed discount, it shouldn't exceed the total of eligible items
          discount = Math.min(promo.value, eligibleAmount);
      }
      
      // Max discount cannot exceed total subtotal
      discount = Math.min(discount, subtotal);

      // Generate detail string
      let details = '';
      if(promo.applicableCategories?.length) details += `${promo.applicableCategories.length} Categories. `;
      if(promo.applicableSubcategories?.length) details += `${promo.applicableSubcategories.length} Sub-cats. `;
      if(promo.applicableVendors?.length) details += `Specific Vendors. `;
      if(promo.applicableProductIds?.length) details += `Specific Products. `;

      setAppliedPromo({ 
          code: promo.code, 
          discountAmount: discount,
          details: details.trim() || 'All Items'
      });
  };

  const total = subtotal + shipping - (appliedPromo ? appliedPromo.discountAmount : 0);

  // Helper just for this screen to proceed to checkout view, 
  // Actual order placement happens in CheckoutScreen usually.
  const proceedToCheckout = () => {
      if(isLoggedIn) {
          navigateTo(AppView.BUYER_CHECKOUT);
      } else {
          setPostLoginAction(() => () => navigateTo(AppView.BUYER_CHECKOUT));
          navigateTo(AppView.LOGIN);
      }
  }

  return (
    <PublicLayout>
      <div className="py-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Shopping Cart</h2>
        {cart.length === 0 ? (
            <div className="bg-white shadow rounded p-12 text-center">
                <h3 className="text-xl text-slate-700">Your cart is empty.</h3>
                <p className="text-slate-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
                <button 
                    onClick={() => navigateTo(AppView.HOME)}
                    className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-medium"
                >
                    Start Shopping
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white shadow rounded overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Quantity</th>
                                <th className="px-6 py-3">Subtotal</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.id} className="border-b border-slate-200">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                            <div>
                                                <span className="font-medium text-slate-800 block">{item.name}</span>
                                                <span className="text-xs text-slate-500">{item.category} {item.subcategory ? `> ${item.subcategory}` : ''}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">N {item.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="number" 
                                            value={item.quantity}
                                            onChange={(e) => handleUpdateCartQuantity(item.id, parseInt(e.target.value))}
                                            min="1"
                                            className="w-20 text-center border-slate-300 rounded bg-white"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-semibold">N {(item.price * item.quantity).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white shadow rounded p-6 h-fit">
                    <h3 className="text-lg font-semibold text-slate-800 border-b pb-3">Cart Summary</h3>
                    <div className="space-y-3 mt-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="font-medium">N {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Shipping</span>
                            <span className="font-medium">N {shipping.toLocaleString()}</span>
                        </div>
                        
                        {/* Coupon Section */}
                        <div className="py-2 border-t border-b border-slate-100 my-2">
                            <div className="flex space-x-2">
                                <input 
                                    type="text" 
                                    placeholder="Coupon Code" 
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                                />
                                <button onClick={handleApplyPromo} className="px-3 py-2 bg-slate-800 text-white rounded text-sm hover:bg-slate-900">Apply</button>
                            </div>
                            {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                            {appliedPromo && (
                                <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded">
                                    <div className="flex justify-between text-green-700 font-medium">
                                        <span>Discount ({appliedPromo.code})</span>
                                        <span>- N {appliedPromo.discountAmount.toLocaleString()}</span>
                                    </div>
                                    {appliedPromo.details && (
                                        <p className="text-xs text-green-600 mt-1 italic text-right">
                                            Applied to: {appliedPromo.details}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between font-bold text-base pt-1">
                            <span>Total</span>
                            <span>N {total.toLocaleString()}</span>
                        </div>
                    </div>
                    <button 
                        onClick={proceedToCheckout}
                        className="mt-6 w-full py-3 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-semibold shadow-lg transform transition hover:-translate-y-0.5"
                    >
                        {isLoggedIn ? 'Proceed to Checkout' : 'Login to Checkout'}
                    </button>
                </div>
            </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default BuyerCartScreen;
