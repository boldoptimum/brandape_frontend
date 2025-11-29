import React, { Suspense } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { AppView } from '../types/index';
import Spinner from '../components/common/Spinner';

// Lazy load screens to optimize bundle size and network usage
// Auth Screens
const JoinScreen = React.lazy(() => import('../screens/auth/JoinScreen'));
const LoginScreen = React.lazy(() => import('../screens/auth/LoginScreen'));
const RegisterScreen = React.lazy(() => import('../screens/auth/RegisterScreen'));
const VerificationScreen = React.lazy(() => import('../screens/auth/VerificationScreen'));
const ForgotPasswordScreen = React.lazy(() => import('../screens/auth/ForgotPasswordScreen'));
const SetNewPasswordScreen = React.lazy(() => import('../screens/auth/SetNewPasswordScreen'));
const CompleteProfileVendorScreen = React.lazy(() => import('../screens/auth/CompleteProfileVendorScreen'));
const CompleteProfileIndividualStep2 = React.lazy(() => import('../screens/auth/CompleteProfileIndividualStep2'));
const CompleteProfileIndividualStep3 = React.lazy(() => import('../screens/auth/CompleteProfileIndividualStep3'));

// Public Screens
const HomeScreen = React.lazy(() => import('../screens/HomeScreen'));
const ProductDetailScreen = React.lazy(() => import('../screens/ProductDetailScreen'));
const CartScreen = React.lazy(() => import('../screens/public/CartScreen'));

// Dashboard Screens
const SettingsScreen = React.lazy(() => import('../screens/SettingsScreen'));
const KycScreen = React.lazy(() => import('../screens/KycScreen'));
const NotFoundScreen = React.lazy(() => import('../screens/NotFoundScreen'));

// Buyer Screens
const BuyerDashboardScreen = React.lazy(() => import('../screens/buyer/BuyerDashboardScreen'));
const BuyerProductsScreen = React.lazy(() => import('../screens/buyer/BuyerProductsScreen'));
const BuyerOrderDetailScreen = React.lazy(() => import('../screens/buyer/BuyerOrderDetailScreen'));
const BuyerCartScreen = React.lazy(() => import('../screens/buyer/BuyerCartScreen'));
const BuyerCheckoutScreen = React.lazy(() => import('../screens/buyer/BuyerCheckoutScreen'));

// Vendor Screens
const VendorDashboardScreen = React.lazy(() => import('../screens/vendor/VendorDashboardScreen'));
const VendorProductsScreen = React.lazy(() => import('../screens/vendor/VendorProductsScreen'));
const VendorOrdersScreen = React.lazy(() => import('../screens/vendor/VendorOrdersScreen'));
const AddEditProductScreen = React.lazy(() => import('../screens/vendor/AddEditProductScreen'));
const VendorOrderDetailScreen = React.lazy(() => import('../screens/vendor/VendorOrderDetailScreen'));
const VendorCustomersScreen = React.lazy(() => import('../screens/vendor/VendorCustomersScreen'));
const VendorWalletScreen = React.lazy(() => import('../screens/vendor/VendorWalletScreen'));

// Support Screens
const SupportDashboardScreen = React.lazy(() => import('../screens/support/SupportDashboardScreen'));
const SupportDisputesScreen = React.lazy(() => import('../screens/support/SupportDisputesScreen'));
const SupportDisputeDetailScreen = React.lazy(() => import('../screens/support/SupportDisputeDetailScreen'));
const SupportLiveChatScreen = React.lazy(() => import('../screens/support/SupportLiveChatScreen'));

// Admin Screens
const AdminDashboardScreen = React.lazy(() => import('../screens/admin/AdminDashboardScreen'));
const AdminUsersScreen = React.lazy(() => import('../screens/admin/AdminUsersScreen'));
const AdminAddEditUserScreen = React.lazy(() => import('../screens/admin/AdminAddEditUserScreen'));
const AdminEditUserScreen = React.lazy(() => import('../screens/admin/AdminEditUserScreen'));
const AdminProductsScreen = React.lazy(() => import('../screens/admin/AdminProductsScreen'));
const AdminCategoriesScreen = React.lazy(() => import('../screens/admin/AdminCategoriesScreen'));
const AdminKycSubmissionsScreen = React.lazy(() => import('../screens/admin/AdminKycSubmissionsScreen'));
const AdminKycDetailScreen = React.lazy(() => import('../screens/admin/AdminKycDetailScreen'));
const AdminKycSettingsScreen = React.lazy(() => import('../screens/admin/AdminKycSettingsScreen'));
const AdminOrdersScreen = React.lazy(() => import('../screens/admin/AdminOrdersScreen'));
const AdminOrderDetailScreen = React.lazy(() => import('../screens/admin/AdminOrderDetailScreen'));
const AdminContentScreen = React.lazy(() => import('../screens/admin/AdminContentScreen'));
const AdminRolesScreen = React.lazy(() => import('../screens/admin/AdminRolesScreen'));
const AdminIntegrationsScreen = React.lazy(() => import('../screens/admin/AdminIntegrationsScreen'));
const AdminPromotionsScreen = React.lazy(() => import('../screens/admin/AdminPromotionsScreen'));
const AdminEmailSettingsScreen = React.lazy(() => import('../screens/admin/AdminEmailSettingsScreen'));
const AdminEmailComposeScreen = React.lazy(() => import('../screens/admin/AdminEmailComposeScreen'));
const AdminBrandingScreen = React.lazy(() => import('../screens/admin/AdminBrandingScreen'));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-slate-50">
    <Spinner size="lg" />
  </div>
);

const AppRouter: React.FC = () => {
  const { view } = useAppContext();

  return (
    <Suspense fallback={<LoadingFallback />}>
        {(() => {
            switch (view) {
                // Auth
                case AppView.JOIN: return <JoinScreen />;
                case AppView.LOGIN: return <LoginScreen />;
                case AppView.REGISTER_INDIVIDUAL:
                case AppView.REGISTER_VENDOR: return <RegisterScreen />;
                case AppView.VERIFY_EMAIL: return <VerificationScreen />;
                case AppView.FORGOT_PASSWORD: return <ForgotPasswordScreen />;
                case AppView.SET_NEW_PASSWORD: return <SetNewPasswordScreen />;
                case AppView.COMPLETE_PROFILE_VENDOR: return <CompleteProfileVendorScreen />;
                case AppView.COMPLETE_PROFILE_INDIVIDUAL_STEP2: return <CompleteProfileIndividualStep2 />;
                case AppView.COMPLETE_PROFILE_INDIVIDUAL_STEP3: return <CompleteProfileIndividualStep3 />;
                
                // Public
                case AppView.HOME: return <HomeScreen />;
                case AppView.PRODUCT_DETAIL: return <ProductDetailScreen />;
                case AppView.CART: return <CartScreen />;
                
                // Generic dashboard
                case AppView.SETTINGS: return <SettingsScreen />;
                case AppView.KYC_SUBMISSION: return <KycScreen />;
                
                // Buyer
                case AppView.BUYER_DASHBOARD: return <BuyerDashboardScreen />;
                case AppView.BUYER_PRODUCTS: return <BuyerProductsScreen />;
                case AppView.BUYER_CART: return <BuyerCartScreen />;
                case AppView.BUYER_CHECKOUT: return <BuyerCheckoutScreen />;
                case AppView.BUYER_ORDER_DETAIL: return <BuyerOrderDetailScreen />;

                // Vendor
                case AppView.VENDOR_DASHBOARD: return <VendorDashboardScreen />;
                case AppView.VENDOR_PRODUCTS: return <VendorProductsScreen />;
                case AppView.VENDOR_ORDERS: return <VendorOrdersScreen />;
                case AppView.VENDOR_ADD_EDIT_PRODUCT: return <AddEditProductScreen />;
                case AppView.VENDOR_ORDER_DETAIL: return <VendorOrderDetailScreen />;
                case AppView.VENDOR_CUSTOMERS: return <VendorCustomersScreen />;
                case AppView.VENDOR_WALLET: return <VendorWalletScreen />;

                // Support
                case AppView.SUPPORT_DASHBOARD: return <SupportDashboardScreen />;
                case AppView.SUPPORT_DISPUTES: return <SupportDisputesScreen />;
                case AppView.SUPPORT_DISPUTE_DETAIL: return <SupportDisputeDetailScreen />;
                case AppView.SUPPORT_LIVE_CHAT: return <SupportLiveChatScreen />;

                // Admin
                case AppView.ADMIN_DASHBOARD: return <AdminDashboardScreen />;
                case AppView.ADMIN_USERS: return <AdminUsersScreen />;
                case AppView.ADMIN_ADD_EDIT_USER: return <AdminAddEditUserScreen />;
                case AppView.ADMIN_EDIT_USER: return <AdminEditUserScreen />;
                case AppView.ADMIN_PRODUCTS: return <AdminProductsScreen />;
                case AppView.ADMIN_CATEGORIES: return <AdminCategoriesScreen />;
                case AppView.ADMIN_ORDERS: return <AdminOrdersScreen />;
                case AppView.ADMIN_ORDER_DETAIL: return <AdminOrderDetailScreen />;
                case AppView.ADMIN_KYC_SUBMISSIONS: return <AdminKycSubmissionsScreen />;
                case AppView.ADMIN_KYC_DETAIL: return <AdminKycDetailScreen />;
                case AppView.ADMIN_KYC_SETTINGS: return <AdminKycSettingsScreen />;
                case AppView.ADMIN_CONTENT_MANAGEMENT: return <AdminContentScreen />;
                case AppView.ADMIN_ROLES: return <AdminRolesScreen />;
                case AppView.ADMIN_INTEGRATIONS: return <AdminIntegrationsScreen />;
                case AppView.ADMIN_PROMOTIONS: return <AdminPromotionsScreen />;
                case AppView.ADMIN_EMAIL_SETTINGS: return <AdminEmailSettingsScreen />;
                case AppView.ADMIN_EMAIL_COMPOSE: return <AdminEmailComposeScreen />;
                case AppView.ADMIN_BRANDING: return <AdminBrandingScreen />;

                default: return <NotFoundScreen />;
            }
        })()}
    </Suspense>
  );
};

export default AppRouter;