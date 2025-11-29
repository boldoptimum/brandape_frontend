
export interface Category {
    id: string;
    name: string;
    subcategories?: string[];
}

export enum AppView {
  JOIN,
  REGISTER_VENDOR,
  REGISTER_INDIVIDUAL,
  VERIFY_EMAIL,
  LOGIN,
  FORGOT_PASSWORD,
  SET_NEW_PASSWORD,
  COMPLETE_PROFILE_VENDOR,
  COMPLETE_PROFILE_INDIVIDUAL_STEP2,
  COMPLETE_PROFILE_INDIVIDUAL_STEP3,
  HOME,
  PRODUCT_DETAIL,
  CART,
  // Generic
  SETTINGS,
  KYC_SUBMISSION,
  NOT_FOUND,
  // Vendor Dashboard
  VENDOR_DASHBOARD,
  VENDOR_PRODUCTS,
  VENDOR_ORDERS,
  VENDOR_ADD_EDIT_PRODUCT,
  VENDOR_ORDER_DETAIL,
  VENDOR_CUSTOMERS,
  VENDOR_WALLET,
  // Buyer Dashboard
  BUYER_DASHBOARD,
  BUYER_PRODUCTS,
  BUYER_ORDER_DETAIL,
  BUYER_CART,
  BUYER_CHECKOUT,
  // Support Dashboard
  SUPPORT_DASHBOARD,
  SUPPORT_DISPUTES,
  SUPPORT_DISPUTE_DETAIL,
  SUPPORT_LIVE_CHAT,
  // Admin Dashboard
  ADMIN_DASHBOARD,
  ADMIN_USERS,
  ADMIN_PRODUCTS,
  ADMIN_CATEGORIES,
  ADMIN_KYC_SUBMISSIONS,
  ADMIN_KYC_DETAIL,
  ADMIN_ORDERS,
  ADMIN_ORDER_DETAIL,
  ADMIN_ADD_EDIT_USER,
  ADMIN_EDIT_USER,
  ADMIN_KYC_SETTINGS,
  ADMIN_CONTENT_MANAGEMENT,
  ADMIN_ROLES,
  ADMIN_INTEGRATIONS,
  ADMIN_PROMOTIONS, 
  ADMIN_EMAIL_SETTINGS, 
  ADMIN_EMAIL_COMPOSE, 
  ADMIN_BRANDING,
}

export enum UserType {
    NONE,
    BUYER,
    VENDOR,
    SUPPORT_AGENT,
    SUPER_ADMIN,
    CUSTOM_ROLE,
}

export type Permission = 'manage_users' | 'manage_products' | 'manage_orders' | 'manage_content' | 'manage_platform' | 'manage_finance' | 'manage_roles' | 'manage_promotions' | 'manage_communications';

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

export interface BankDetails {
    bankName: string;
    accountNumber: string;
    accountName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  roleId?: string; // For custom roles
  password?: string;
  avatarUrl: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  phone: string;
  registeredDate: string;
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  kycStatus: 'Not Submitted' | 'Pending' | 'Verified' | 'Rejected';
  kycRejectionReason?: string;
  bankDetails?: BankDetails;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    avatarUrl: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  imageUrl: string;
  images: string[];
  price: number;
  stock: number;
  category: string;
  subcategory?: string;
  sales: number;
  status: string;
  description: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  specs: { key: string; value: string }[];
}

export type OrderStatus = 'Pending' | 'Payment in Escrow' | 'Processing' | 'Ready for Pickup' | 'Shipped' | 'In Transit' | 'Arrived at Terminal' | 'Out for Delivery' | 'Delivered' | 'Completed' | 'Cancelled' | 'Disputed' | 'Refunded';

export interface TrackingEvent {
    status: OrderStatus | 'Order Placed';
    date: string;
    location?: string;
    description?: string;
}

export interface Order {
  id: string;
  date: string;
  customer: string; // Should be customerId in a real app
  customerId: string;
  total: number;
  subtotal?: number; // Original price before discount
  discount?: number; // Amount deducted
  status: OrderStatus;
  items: Product[]; // Simplified; should be OrderItem[] with price and quantity
  shippingAddress: {
    street: string;
    city: string;
    country: string;
  };
  trackingNumber?: string;
  freightCarrier?: string;
  paymentMethod: string;
  trackingHistory: TrackingEvent[];
  usedEscrow: boolean;
  promoCode?: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  buyer: string;
  vendor: string;
  reason: string;
  status: string;
  date: string;
  messages: {
    user: string; // should be userId
    text: string;
    timestamp: string;
  }[];
  resolution?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'order' | 'dispute' | 'system' | 'product' | 'kyc' | 'wallet';
    message: string;
    date: string;
    read: boolean;
    link?: string; // e.g. /vendor/orders/detail
}

export interface Transaction {
    id: string;
    date: string;
    type: 'Payout' | 'Fee' | 'Sale' | 'Escrow Release' | 'Refund';
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
    description: string;
}

export interface KycField {
    id: string;
    label: string;
    type: 'text' | 'file';
    required?: boolean;
    // File specific
    allowedFormats?: string[]; // ['.pdf', '.jpg', '.png']
    maxSize?: number; // MB
    // Text specific
    textInputType?: 'text' | 'number' | 'date' | 'email';
    placeholder?: string;
}

export interface FeatureItem {
  icon: 'FastShippingIcon' | 'CustomerSupportIcon' | 'SecurePaymentIcon' | 'MoneyBackIcon';
  title: string;
  description: string;
}

export interface SiteBranding {
    logoDark: string;  
    logoLight: string; 
    favicon: string;
}

export interface HeroSlide {
    title: string;
    subtitle: string;
    imageUrl: string;
}

export interface HomepageContent {
  marquee: {
      enabled: boolean;
      items: string[];
  };
  hero: {
      enabled: boolean;
      mode: 'static' | 'slider';
      slides: HeroSlide[]; // Should contain at least 1 slide if static
      autoplay: boolean;
      interval: number;
      // Legacy support for static (mapped to slides[0] in logic)
      heroTitle?: string;
      heroSubtitle?: string;
      heroImageUrl?: string;
  };
  promo: {
      enabled: boolean;
      text: string;
      imageUrl: string;
  };
  features: {
      enabled: boolean;
      items: FeatureItem[];
  };
  deliverySection: {
    enabled: boolean;
    title: string;
    description: string;
    subDescription: string;
    buttonText: string;
    imageUrl: string;
  };
  branding?: SiteBranding;
}

export interface Integration {
    id: string;
    name: string;
    provider: 'DHL' | 'FedEx' | 'Local Freight' | 'Custom API';
    apiKey: string;
    webhookUrl?: string;
    status: 'Active' | 'Inactive';
}

export interface Promotion {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    expiryDate: string;
    usageLimit?: number;
    usageCount: number;
    status: 'Active' | 'Inactive';
    applicableCategories?: string[]; 
    applicableSubcategories?: string[]; // New
    applicableVendors?: string[]; // New
    applicableProductIds?: string[]; // New
}

export interface EmailConfiguration {
    host: string;
    port: string;
    username: string;
    password?: string; // In real app, secure this
    encryption: 'ssl' | 'tls' | 'none';
    senderName: string;
    senderEmail: string;
}

export interface CampaignGroup {
    id: string;
    name: string;
    userIds: string[];
    description?: string;
}

export interface EmailLog {
    id: string;
    date: string;
    recipientGroup: string; // 'All Users', 'Buyer', etc.
    recipientEmail?: string;
    subject: string;
    status: 'Sent' | 'Failed';
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
    isAdmin: boolean; // true if sent by support/admin
}

export interface ChatSession {
    id: string;
    userId: string;
    userName: string;
    userType: UserType;
    agentId?: string;
    status: 'Open' | 'Closed';
    lastMessage: string;
    lastMessageDate: string;
    messages: ChatMessage[];
    unreadCount: number; // For support side
}