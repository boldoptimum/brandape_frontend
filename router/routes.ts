
import { AppView } from '../types/index';

export const viewToPath: Record<AppView, string> = {
    [AppView.HOME]: '',
    [AppView.PRODUCT_DETAIL]: 'product/view',
    [AppView.CART]: 'cart',
    [AppView.JOIN]: 'join',
    [AppView.REGISTER_VENDOR]: 'register/vendor',
    [AppView.REGISTER_INDIVIDUAL]: 'register/buyer',
    [AppView.VERIFY_EMAIL]: 'verify-email',
    [AppView.LOGIN]: 'login',
    [AppView.FORGOT_PASSWORD]: 'forgot-password',
    [AppView.SET_NEW_PASSWORD]: 'set-new-password',
    [AppView.COMPLETE_PROFILE_VENDOR]: 'complete-profile/vendor',
    [AppView.COMPLETE_PROFILE_INDIVIDUAL_STEP2]: 'complete-profile/buyer/step2',
    [AppView.COMPLETE_PROFILE_INDIVIDUAL_STEP3]: 'complete-profile/buyer/step3',
    
    [AppView.SETTINGS]: 'settings',
    [AppView.KYC_SUBMISSION]: 'settings/kyc',
    [AppView.NOT_FOUND]: '404',

    [AppView.VENDOR_DASHBOARD]: 'vendor/dashboard',
    [AppView.VENDOR_PRODUCTS]: 'vendor/products',
    [AppView.VENDOR_ORDERS]: 'vendor/orders',
    [AppView.VENDOR_ADD_EDIT_PRODUCT]: 'vendor/products/edit',
    [AppView.VENDOR_ORDER_DETAIL]: 'vendor/orders/detail',
    [AppView.VENDOR_CUSTOMERS]: 'vendor/customers',
    [AppView.VENDOR_WALLET]: 'vendor/wallet',

    [AppView.BUYER_DASHBOARD]: 'buyer/dashboard',
    [AppView.BUYER_PRODUCTS]: 'buyer/products',
    [AppView.BUYER_ORDER_DETAIL]: 'buyer/orders/detail',
    [AppView.BUYER_CART]: 'buyer/cart',
    [AppView.BUYER_CHECKOUT]: 'buyer/checkout',

    [AppView.SUPPORT_DASHBOARD]: 'support/dashboard',
    [AppView.SUPPORT_DISPUTES]: 'support/disputes',
    [AppView.SUPPORT_DISPUTE_DETAIL]: 'support/disputes/detail',
    [AppView.SUPPORT_LIVE_CHAT]: 'support/chat',

    [AppView.ADMIN_DASHBOARD]: 'admin/dashboard',
    [AppView.ADMIN_USERS]: 'admin/users',
    [AppView.ADMIN_ADD_EDIT_USER]: 'admin/users/add',
    [AppView.ADMIN_EDIT_USER]: 'admin/users/edit',
    [AppView.ADMIN_PRODUCTS]: 'admin/products',
    [AppView.ADMIN_CATEGORIES]: 'admin/categories',
    [AppView.ADMIN_KYC_SUBMISSIONS]: 'admin/kyc',
    [AppView.ADMIN_KYC_DETAIL]: 'admin/kyc/detail',
    [AppView.ADMIN_KYC_SETTINGS]: 'admin/kyc/settings',
    [AppView.ADMIN_ORDERS]: 'admin/orders',
    [AppView.ADMIN_ORDER_DETAIL]: 'admin/orders/detail',
    [AppView.ADMIN_CONTENT_MANAGEMENT]: 'admin/content',
    [AppView.ADMIN_ROLES]: 'admin/roles',
    [AppView.ADMIN_INTEGRATIONS]: 'admin/integrations',
    [AppView.ADMIN_PROMOTIONS]: 'admin/promotions',
    [AppView.ADMIN_EMAIL_SETTINGS]: 'admin/email/settings',
    [AppView.ADMIN_EMAIL_COMPOSE]: 'admin/email/compose',
    [AppView.ADMIN_BRANDING]: 'admin/branding',
};

export const pathToView = Object.entries(viewToPath).reduce((acc, [key, value]) => {
    acc[value] = Number(key) as AppView;
    return acc;
}, {} as Record<string, AppView>);
