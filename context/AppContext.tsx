
import React from 'react';
import { dataService } from '../services/dataService';
import { AppView, User, Product, Order, Category, Dispute, Notification, Transaction, KycField, HomepageContent, CartItem, UserType, Role, Promotion, EmailConfiguration, EmailLog, ChatSession, ChatMessage, CampaignGroup, Review } from '../types/index';
import { viewToPath, pathToView } from '../router/routes';

interface ConfirmationState {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export interface AppContextState {
  // State
  view: AppView;
  currentUser: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  toast: { message: string, type: 'success' | 'error' } | null;
  confirmation: ConfirmationState | null;
  criticalError: string | null;
  
  // Data
  users: User[];
  products: Product[];
  orders: Order[];
  categories: Category[];
  disputes: Dispute[];
  notifications: Notification[];
  transactions: Transaction[];
  kycFields: KycField[];
  homepageContent: HomepageContent | null;
  roles: Role[];
  promotions: Promotion[];
  emailSettings: EmailConfiguration | null;
  emailLogs: EmailLog[];
  chatSessions: ChatSession[];
  campaignGroups: CampaignGroup[];
  
  // UI State
  cart: CartItem[];
  cartCount: number;
  joiningUserType: UserType;
  registrationEmail: string;
  selectedProduct: Product | null;
  selectedOrder: Order | null;
  selectedDispute: Dispute | null;
  selectedUserToEdit: User | null;
  selectedKycUser: User | null;
  searchQuery: string;
  postLoginAction: (() => void) | null;
  isChatWidgetOpen: boolean;
  activeChatSessionId: string | null;

  // Functions
  navigateTo: (view: AppView, replace?: boolean) => void;
  setToast: (toast: { message: string, type: 'success' | 'error' } | null) => void;
  setConfirmation: (confirmation: ConfirmationState | null) => void;
  setJoiningUserType: (type: UserType) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedOrder: (order: Order | null) => void;
  setSelectedDispute: (dispute: Dispute | null) => void;
  setSelectedUserToEdit: (user: User | null) => void;
  setSelectedKycUser: (user: User | null) => void;
  setSearchQuery: (query: string) => void;
  loadInitialData: () => Promise<void>;
  setCriticalError: (error: string | null) => void;
  setPostLoginAction: (action: (() => void) | null) => void;

  // Auth
  handleLogin: (email: string, password: string) => Promise<boolean>;
  handleLogout: () => void;
  handleRegister: (email: string, password: string, name: string, type: UserType) => void;
  completeRegistration: () => void;
  handleForgotPassword: (email: string) => void;
  handleSetNewPassword: (password: string) => void;
  finishOnboarding: (name: string, bankDetails?: any) => void;

  // Cart & Orders
  handleAddToCart: (product: Product, quantity?: number) => void;
  handleUpdateCartQuantity: (productId: string, quantity: number) => void;
  handleRemoveFromCart: (productId: string) => void;
  handlePlaceOrder: (useEscrow: boolean, discount?: number, promoCode?: string) => void;
  handleConfirmDelivery: (orderId: string) => void;
  handleCreateDispute: (orderId: string, reason: string) => void;
  handleUpdateOrderStatus: (orderId: string, status: Order['status'], location?: string) => void;
  
  // Profile
  handleUpdateProfile: (name: string, phone: string, avatarUrl: string) => void;
  handleUpdatePassword: (password: string) => void;
  handleUpdateAddress: (address: User['address']) => void;
  handleKycSubmit: () => void;
  
  // Vendor
  handleAddProduct: (productData: Omit<Product, 'id' | 'sales' | 'vendorId' | 'rating' | 'reviewCount' | 'reviews'>) => void;
  handleUpdateProduct: (productData: Omit<Product, 'id' | 'sales' | 'vendorId' | 'rating' | 'reviewCount' | 'reviews'>) => void;
  handleDeleteProduct: (product: Product) => void;
  handleRequestPayout: (amount: number) => void;
  
  // Support
  handleAddDisputeMessage: (disputeId: string, message: { user: string; text: string; timestamp: string; }) => void;
  handleUpdateDisputeStatus: (disputeId: string, status: string, resolutionAction?: {type: 'refund', amount?: number} | {type: 'release'}) => void;

  // Chat
  toggleChatWidget: () => void;
  handleStartSupportChat: (initialMessage: string) => Promise<void>;
  handleSendChatMessage: (sessionId: string, text: string, isAdmin?: boolean) => Promise<void>;
  handleResolveChat: (sessionId: string) => void;

  // Reviews
  handleAddReview: (productId: string, rating: number, comment: string) => Promise<void>;

  // Admin
  handleDeactivateUser: (user: User) => void;
  handleBulkDeactivateUsers: (users: User[]) => void;
  handleUpdateKycStatus: (userId: string, status: 'Verified' | 'Rejected', reason?: string) => void;
  handleCreateUser: (newUser: Omit<User, 'id' | 'avatarUrl' | 'address' | 'phone' | 'registeredDate' | 'lastLogin' | 'status' | 'kycStatus'>) => void;
  handleUpdateUser: (updatedUser: User) => void;
  handleUpdateKycFields: (fields: KycField[]) => void;
  handleUpdateHomepageContent: (content: HomepageContent) => void;
  handleAddCategory: (name: string) => void;
  handleUpdateCategory: (id: string, newName: string) => void;
  handleDeleteCategory: (category: Category) => void;
  handleAddSubCategory: (categoryId: string, subCategoryName: string) => void;
  handleDeleteSubCategory: (categoryId: string, subCategoryName: string) => void;
  handleBulkDeleteProducts: (products: Product[]) => void;
  
  // Promotions & Email
  handleCreatePromotion: (promo: Omit<Promotion, 'id' | 'usageCount' | 'status'>) => void;
  handleDeletePromotion: (id: string) => void;
  handleSaveEmailConfig: (config: EmailConfiguration) => void;
  handleSendEmail: (recipientGroup: string, subject: string, body: string, specificUserId?: string) => void;
  handleCreateCampaignGroup: (name: string, userIds: string[], description?: string) => Promise<void>;
  handleDeleteCampaignGroup: (id: string) => Promise<void>;
  
  // Roles
  handleAddRole: (role: Role) => void;
  handleUpdateRole: (role: Role) => void;
  handleDeleteRole: (roleId: string) => void;
}

export const AppContext = React.createContext<AppContextState | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = React.useState<AppView>(AppView.HOME);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [toast, setToast] = React.useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [confirmation, setConfirmation] = React.useState<ConfirmationState | null>(null);
  const [criticalError, setCriticalError] = React.useState<string | null>(null);

  // Data states
  const [users, setUsers] = React.useState<User[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [disputes, setDisputes] = React.useState<Dispute[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [kycFields, setKycFields] = React.useState<KycField[]>([]);
  const [homepageContent, setHomepageContent] = React.useState<HomepageContent | null>(null);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [promotions, setPromotions] = React.useState<Promotion[]>([]);
  const [emailSettings, setEmailSettings] = React.useState<EmailConfiguration | null>(null);
  const [emailLogs, setEmailLogs] = React.useState<EmailLog[]>([]);
  const [chatSessions, setChatSessions] = React.useState<ChatSession[]>([]);
  const [campaignGroups, setCampaignGroups] = React.useState<CampaignGroup[]>([]);

  // UI states
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [joiningUserType, setJoiningUserType] = React.useState<UserType>(UserType.NONE);
  const [registrationEmail, setRegistrationEmail] = React.useState<string>('');
  const [selectedProduct, setSelectedProductState] = React.useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [selectedDispute, setSelectedDispute] = React.useState<Dispute | null>(null);
  const [selectedUserToEdit, setSelectedUserToEdit] = React.useState<User | null>(null);
  const [selectedKycUser, setSelectedKycUser] = React.useState<User | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [postLoginAction, setPostLoginAction] = React.useState<(() => void) | null>(null);
  
  // Chat UI State
  const [isChatWidgetOpen, setIsChatWidgetOpen] = React.useState(false);
  const [activeChatSessionId, setActiveChatSessionId] = React.useState<string | null>(null);

  const navigateTo = (newView: AppView, replace = false) => {
    setView(newView);
    const path = viewToPath[newView];
    if (path !== undefined) {
      try {
          if(replace) {
            window.history.replaceState({ view: newView }, '', `/${path}`);
          } else {
            window.history.pushState({ view: newView }, '', `/${path}`);
          }
      } catch (e) {
          // Ignore history errors in confined environments
      }
    }
  };

  const loadInitialData = React.useCallback(async () => {
    setIsLoading(true);
    setCriticalError(null);
    try {
        const [
            cats, usersData, prods, ords, disps, notifs, trans, kyc, content, promos, emailSet, logs, chats, campaigns
        ] = await Promise.all([
            dataService.getCategories(),
            dataService.getUsers(),
            dataService.getProducts(),
            dataService.getOrders(),
            dataService.getDisputes(),
            dataService.getNotifications(),
            dataService.getTransactions(),
            dataService.getKycFields(),
            dataService.getHomepageContent(),
            dataService.getPromotions(),
            dataService.getEmailSettings(),
            dataService.getEmailLogs(),
            dataService.getChatSessions(),
            dataService.getCampaignGroups(),
        ]);
        setCategories(cats);
        setUsers(usersData);
        setProducts(prods);
        setOrders(ords);
        setDisputes(disps);
        setNotifications(notifs);
        setTransactions(trans);
        setKycFields(kyc.fields);
        setHomepageContent(content);
        setPromotions(promos);
        setEmailSettings(emailSet);
        setEmailLogs(logs);
        setChatSessions(chats || []);
        setCampaignGroups(campaigns || []);
        setRoles([
            { id: 'role_admin', name: 'Super Admin', permissions: ['manage_users', 'manage_products', 'manage_orders', 'manage_content', 'manage_platform', 'manage_finance', 'manage_roles'] },
            { id: 'role_manager', name: 'Content Manager', permissions: ['manage_content', 'manage_products'] }
        ]);
    } catch (error) {
        const errorMessage = 'Failed to load initial data. Please ensure the backend server is running.';
        console.error("Failed to load initial data", error);
        setCriticalError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  }, []);
  
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
        const path = window.location.pathname.slice(1);
        const newView = pathToView[path] ?? AppView.NOT_FOUND;
        setView(newView);
    };
    window.addEventListener('popstate', handlePopState);
    
    // Initial load
    const path = window.location.pathname.slice(1);
    const initialView = pathToView[path] ?? AppView.HOME;
    if(view !== initialView) setView(initialView);
    
    loadInitialData();

    return () => {
        window.removeEventListener('popstate', handlePopState);
    };
  }, [loadInitialData]);

  const isLoggedIn = !!currentUser;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getDashboardViewForUser = (user: User) => {
      switch (user.type) {
          case UserType.BUYER: return AppView.BUYER_DASHBOARD;
          case UserType.VENDOR: return AppView.VENDOR_DASHBOARD;
          case UserType.SUPPORT_AGENT: return AppView.SUPPORT_DASHBOARD;
          case UserType.SUPER_ADMIN: return AppView.ADMIN_DASHBOARD;
          case UserType.CUSTOM_ROLE: return AppView.ADMIN_DASHBOARD; // Default for now
          default: return AppView.LOGIN;
      }
  };

  // Auth Handlers
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
        const user = await dataService.login(email, password);
        if (user) {
            setCurrentUser(user);
            setToast({ message: `Welcome back, ${user.name}!`, type: 'success' });
            if (postLoginAction) {
                postLoginAction();
                setPostLoginAction(null);
            } else {
                navigateTo(getDashboardViewForUser(user), true);
            }
            return true;
        }
        return false;
    } catch (e) {
        console.error(e);
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setConfirmation({
        title: "Confirm Logout",
        message: "Are you sure you want to log out?",
        onConfirm: () => {
            setCurrentUser(null);
            navigateTo(AppView.HOME, true);
            setToast({ message: "You have been logged out.", type: 'success' });
        }
    });
  };

  const handleRegister = async (email: string, password: string, name: string, type: UserType) => {
      setIsLoading(true);
      try {
          await dataService.createUser({ email, password, name, type });
          setRegistrationEmail(email);
          setToast({ message: "Registration successful! Please check your email for a verification code.", type: 'success' });
          navigateTo(AppView.VERIFY_EMAIL);
      } catch (e) {
          console.error(e);
          setToast({ message: 'Registration failed. Please try again.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };
  
  const completeRegistration = () => {
      const nextView = joiningUserType === UserType.VENDOR ? AppView.COMPLETE_PROFILE_VENDOR : AppView.COMPLETE_PROFILE_INDIVIDUAL_STEP2;
      navigateTo(nextView);
  };
  
  const handleForgotPassword = (email: string) => {
    setRegistrationEmail(email);
    setToast({ message: `Password reset instructions sent to ${email}.`, type: 'success' });
    navigateTo(AppView.SET_NEW_PASSWORD);
  };

  const handleSetNewPassword = async (password: string) => {
    setIsLoading(true);
    try {
        await dataService.updatePassword(registrationEmail, password);
        setToast({ message: "Password updated successfully. Please log in.", type: 'success' });
        navigateTo(AppView.LOGIN, true);
    } catch (e) {
        setToast({ message: "Failed to update password.", type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };
  
  const finishOnboarding = async (name: string, bankDetails?: any) => {
    if (registrationEmail && bankDetails) {
        const tempUsers = await dataService.getUsers();
        const user = tempUsers.find(u => u.email === registrationEmail);
        if (user) {
            await dataService.updateUser(user.id, { bankDetails });
        }
    }
    setToast({ message: `Welcome, ${name}! Your profile is complete. Please log in.`, type: 'success' });
    navigateTo(AppView.LOGIN, true);
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    if (product.stock < 1) {
        setToast({ message: 'This product is out of stock.', type: 'error' });
        return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
    setToast({ message: `${product.name} added to cart.`, type: 'success' });
  };
  
  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(cart.map(item => item.id === productId ? { ...item, quantity } : item));
  };
  
  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handlePlaceOrder = async (useEscrow: boolean, discount: number = 0, promoCode?: string) => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
          const newOrder = await dataService.createOrder(cart, currentUser, useEscrow, discount, promoCode);
          setOrders([...orders, newOrder]);
          setCart([]);
      } catch (e) {
          setToast({ message: 'Failed to place order.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleConfirmDelivery = async (orderId: string) => {
    setIsLoading(true);
    try {
        const updatedOrder = await dataService.updateOrder(orderId, { status: 'Completed' });
        setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
        setToast({ message: `Order #${orderId} marked as complete.`, type: 'success' });
    } catch (e) {
        setToast({ message: 'Failed to update order.', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleCreateDispute = async (orderId: string, reason: string) => {
      if (!currentUser) return;
      const order = orders.find(o => o.id === orderId);
      const vendor = users.find(u => u.id === order?.items[0]?.vendorId);
      if (!order || !vendor) return;

      setIsLoading(true);
      try {
          const newDispute = await dataService.createDispute(orderId, reason, currentUser.name, vendor.name);
          setDisputes([...disputes, newDispute]);
          const updatedOrder = await dataService.updateOrder(orderId, { status: 'Disputed' });
          setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
          setToast({ message: 'Dispute created successfully.', type: 'success' });
          navigateTo(AppView.BUYER_DASHBOARD);
      } catch (e) {
          setToast({ message: 'Failed to create dispute.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };
  
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status'], location?: string) => {
    setIsLoading(true);
    try {
        const order = orders.find(o => o.id === orderId);
        if(!order) return;

        let history = [...order.trackingHistory];
        history.push({
            status: status,
            date: new Date().toISOString(),
            location: location || undefined
        });

        const updatedOrder = await dataService.updateOrder(orderId, { status, trackingHistory: history });
        setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
        setToast({ message: `Order #${orderId} status updated to ${status}.`, type: 'success' });
    } catch (e) {
        setToast({ message: 'Failed to update order status.', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (name: string, phone: string, avatarUrl: string) => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const updatedUser = await dataService.updateUser(currentUser.id, { name, phone, avatarUrl });
        setCurrentUser(updatedUser);
        setToast({ message: 'Profile updated successfully!', type: 'success' });
      } catch(e) {
        setToast({ message: 'Failed to update profile.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
  };
  
  const handleUpdatePassword = async (password: string) => {
     if (!currentUser) return;
     setToast({ message: 'Password updated successfully!', type: 'success' });
  };
  
  const handleUpdateAddress = async (address: User['address']) => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const updatedUser = await dataService.updateUser(currentUser.id, { address });
        setCurrentUser(updatedUser);
        setToast({ message: 'Address updated successfully!', type: 'success' });
      } catch(e) {
        setToast({ message: 'Failed to update address.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
  };
  
  const handleKycSubmit = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
        const updatedUser = await dataService.updateUser(currentUser.id, { kycStatus: 'Pending' });
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
        setToast({ message: 'KYC documents submitted for review.', type: 'success' });
        navigateTo(AppView.SETTINGS);
    } catch (e) {
        setToast({ message: 'Failed to submit KYC.', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };
  
  const setSelectedProduct = (product: Product | null) => {
      setSelectedProductState(product);
      if (product) {
          navigateTo(AppView.PRODUCT_DETAIL);
      }
  };
  
  const handleAddProduct = async (productData: Omit<Product, 'id' | 'sales' | 'vendorId' | 'rating' | 'reviewCount' | 'reviews'>) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
        const newProduct = await dataService.createProduct(productData, currentUser.id);
        setProducts([...products, newProduct]);
        setToast({ message: 'Product added successfully!', type: 'success' });
        navigateTo(AppView.VENDOR_PRODUCTS);
    } catch (e) {
        setToast({ message: 'Failed to add product.', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleUpdateProduct = async (productData: Omit<Product, 'id' | 'sales' | 'vendorId' | 'rating' | 'reviewCount' | 'reviews'>) => {
      if (!selectedProduct) return;
      setIsLoading(true);
      try {
          const updatedProduct = await dataService.updateProduct(selectedProduct.id, productData);
          setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p));
          setToast({ message: 'Product updated successfully!', type: 'success' });
          navigateTo(AppView.VENDOR_PRODUCTS);
      } catch (e) {
          setToast({ message: 'Failed to update product.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };
  
  const handleDeleteProduct = (product: Product) => {
      setConfirmation({
          title: 'Delete Product',
          message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
          onConfirm: async () => {
              setIsLoading(true);
              try {
                  await dataService.deleteProduct(product.id);
                  setProducts(products.filter(p => p.id !== product.id));
                  setToast({ message: 'Product deleted successfully.', type: 'success' });
              } catch (e) {
                  setToast({ message: 'Failed to delete product.', type: 'error' });
              } finally {
                  setIsLoading(false);
              }
          }
      });
  };

  const handleRequestPayout = async (amount: number) => {
    setIsLoading(true);
    try {
        const newTransaction = await dataService.createTransaction({
            date: new Date().toISOString().split('T')[0],
            type: 'Payout',
            amount: -amount,
            status: 'Pending',
            description: 'Withdrawal request'
        });
        setTransactions([...transactions, newTransaction]);
        setToast({ message: 'Payout requested successfully!', type: 'success' });
    } catch (e) {
        setToast({ message: 'Failed to request payout.', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAddDisputeMessage = async (disputeId: string, message: { user: string; text: string; timestamp: string; }) => {
      const dispute = disputes.find(d => d.id === disputeId);
      if (!dispute) return;
      const updatedMessages = [...dispute.messages, message];
      setIsLoading(true);
      try {
        const updatedDispute = await dataService.updateDispute(disputeId, { messages: updatedMessages });
        setDisputes(disputes.map(d => d.id === disputeId ? updatedDispute : d));
      } catch (e) {
        setToast({ message: 'Failed to send message.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
  };

  const handleUpdateDisputeStatus = async (disputeId: string, status: string, resolutionAction?: {type: 'refund', amount?: number} | {type: 'release'}) => {
      const dispute = disputes.find(d => d.id === disputeId);
      if (!dispute) return;
      setIsLoading(true);
      try {
        const updatedDispute = await dataService.updateDispute(disputeId, { status });
        setDisputes(disputes.map(d => d.id === disputeId ? updatedDispute : d));
        setToast({ message: `Dispute status updated to ${status}.`, type: 'success' });
      } catch (e) {
        setToast({ message: 'Failed to update dispute.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
  };

  // Chat Handlers
  const toggleChatWidget = () => setIsChatWidgetOpen(!isChatWidgetOpen);

  const handleStartSupportChat = async (initialMessage: string) => {
      if (!currentUser) return;
      const existing = chatSessions.find(c => c.userId === currentUser.id && c.status === 'Open');
      if (existing) {
          handleSendChatMessage(existing.id, initialMessage);
          return;
      }

      setIsLoading(true);
      try {
          const newSession = await dataService.createChatSession(currentUser.id, currentUser.name, currentUser.type, initialMessage);
          setChatSessions([...chatSessions, newSession]);
          setActiveChatSessionId(newSession.id);
      } catch (e) {
          setToast({ message: 'Failed to start chat', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleSendChatMessage = async (sessionId: string, text: string, isAdmin = false) => {
      const session = chatSessions.find(s => s.id === sessionId);
      if (!session) return;

      const newMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          senderId: isAdmin ? (currentUser?.id || 'agent') : session.userId,
          senderName: isAdmin ? (currentUser?.name || 'Agent') : session.userName,
          text,
          timestamp: new Date().toISOString(),
          isAdmin
      };

      const updatedMessages = [...session.messages, newMessage];
      const updatedSession = { 
          ...session, 
          messages: updatedMessages, 
          lastMessage: text, 
          lastMessageDate: newMessage.timestamp,
          unreadCount: isAdmin ? 0 : (session.unreadCount + 1)
      };

      setChatSessions(chatSessions.map(s => s.id === sessionId ? updatedSession : s));

      try {
          await dataService.updateChatSession(sessionId, { 
              messages: updatedMessages, 
              lastMessage: text, 
              lastMessageDate: newMessage.timestamp,
              unreadCount: updatedSession.unreadCount
          });
      } catch (e) {
          console.error("Failed to send message", e);
      }
  };

  const handleResolveChat = async (sessionId: string) => {
      try {
          await dataService.updateChatSession(sessionId, { status: 'Closed' });
          setChatSessions(chatSessions.map(s => s.id === sessionId ? { ...s, status: 'Closed' } : s));
          setToast({ message: 'Chat resolved.', type: 'success' });
      } catch (e) {
          setToast({ message: 'Failed to close chat.', type: 'error' });
      }
  };

  const handleAddReview = async (productId: string, rating: number, comment: string) => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
          const reviewData = {
              productId,
              userId: currentUser.id,
              userName: currentUser.name,
              avatarUrl: currentUser.avatarUrl,
              rating,
              comment
          };
          const newReview = await dataService.addReview(productId, reviewData);
          
          setProducts(prev => prev.map(p => {
              if (p.id === productId) {
                  const newReviews = [...p.reviews, newReview];
                  const newRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
                  return { ...p, reviews: newReviews, rating: newRating, reviewCount: newReviews.length };
              }
              return p;
          }));
          
          setToast({ message: 'Review submitted successfully!', type: 'success' });
      } catch (e) {
          setToast({ message: 'Failed to submit review.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleDeactivateUser = (user: User) => {
     setConfirmation({
         title: "Deactivate User",
         message: `Are you sure you want to deactivate ${user.name}?`,
         onConfirm: async () => {
             setIsLoading(true);
             try {
                 await dataService.updateUser(user.id, { status: 'Inactive' });
                 setUsers(users.map(u => u.id === user.id ? {...u, status: 'Inactive'} : u));
                 setToast({ message: 'User deactivated.', type: 'success'});
             } catch(e) {
                 setToast({ message: 'Failed to deactivate user.', type: 'error'});
             } finally {
                 setIsLoading(false);
             }
         }
     })
  };

  const handleBulkDeactivateUsers = (usersToDeactivate: User[]) => {
       setConfirmation({
         title: "Deactivate Users",
         message: `Are you sure you want to deactivate ${usersToDeactivate.length} users?`,
         onConfirm: async () => {
             setIsLoading(true);
             try {
                 await Promise.all(usersToDeactivate.map(u => dataService.updateUser(u.id, { status: 'Inactive' })));
                 const idsToDeactivate = usersToDeactivate.map(u => u.id);
                 setUsers(users.map(u => idsToDeactivate.includes(u.id) ? {...u, status: 'Inactive'} : u));
                 setToast({ message: 'Users deactivated.', type: 'success'});
             } catch(e) {
                 setToast({ message: 'Failed to deactivate users.', type: 'error'});
             } finally {
                 setIsLoading(false);
             }
         }
     })
  };
  
  const handleBulkDeleteProducts = (productsToDelete: Product[]) => {
      setConfirmation({
          title: "Delete Products",
          message: `Are you sure you want to delete ${productsToDelete.length} products?`,
          onConfirm: async () => {
              setIsLoading(true);
              try {
                  await Promise.all(productsToDelete.map(p => dataService.deleteProduct(p.id)));
                  const idsToDelete = productsToDelete.map(p => p.id);
                  setProducts(products.filter(p => !idsToDelete.includes(p.id)));
                  setToast({ message: 'Products deleted.', type: 'success' });
              } catch(e) {
                  setToast({ message: 'Failed to delete products.', type: 'error' });
              } finally {
                  setIsLoading(false);
              }
          }
      })
  };
  
  const handleUpdateKycStatus = async (userId: string, status: 'Verified' | 'Rejected', reason?: string) => {
    setIsLoading(true);
    try {
        const updatedUser = await dataService.updateUser(userId, { kycStatus: status, kycRejectionReason: reason });
        setUsers(users.map(u => u.id === userId ? updatedUser : u));
        setToast({ message: `KYC for ${updatedUser.name} has been ${status.toLowerCase()}.`, type: 'success' });
        navigateTo(AppView.ADMIN_KYC_SUBMISSIONS);
    } catch(e) {
        setToast({ message: 'Failed to update KYC status.', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleCreateUser = async (newUser: Omit<User, 'id' | 'avatarUrl' | 'address' | 'phone' | 'registeredDate' | 'lastLogin' | 'status' | 'kycStatus'>) => {
      setIsLoading(true);
      try {
          const createdUser = await dataService.createUser(newUser);
          setUsers([...users, createdUser]);
          setToast({ message: 'User created successfully.', type: 'success' });
          navigateTo(AppView.ADMIN_USERS);
      } catch (e) {
          setToast({ message: 'Failed to create user.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };
  
  const handleUpdateUser = async (updatedUser: User) => {
      setIsLoading(true);
      try {
          const returnedUser = await dataService.fullUpdateUser(updatedUser);
          setUsers(users.map(u => u.id === updatedUser.id ? returnedUser : u));
          setToast({ message: 'User updated successfully.', type: 'success' });
          navigateTo(AppView.ADMIN_USERS);
      } catch (e) {
          setToast({ message: 'Failed to update user.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleUpdateKycFields = async (fields: KycField[]) => {
      setIsLoading(true);
      try {
          const updated = await dataService.updateKycFields(fields);
          setKycFields(updated.fields);
          setToast({ message: 'KYC fields updated.', type: 'success' });
      } catch (e) {
          setToast({ message: 'Failed to update KYC fields.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };
  
  const handleUpdateHomepageContent = async (content: HomepageContent) => {
      setIsLoading(true);
      try {
          const updated = await dataService.updateHomepageContent(content);
          setHomepageContent(updated);
          setToast({ message: 'Homepage content updated.', type: 'success' });
      } catch (e) {
          setToast({ message: 'Failed to update homepage content.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleAddCategory = async (name: string) => {
    setIsLoading(true);
    try {
        const newCategory = await dataService.createCategory({ name, subcategories: [] });
        setCategories([...categories, newCategory]);
        setToast({ message: 'Category added.', type: 'success' });
    } catch(e) {
        setToast({ message: 'Failed to add category.', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdateCategory = async (id: string, newName: string) => {
    setIsLoading(true);
    try {
        const updatedCategory = await dataService.updateCategory(id, { name: newName });
        setCategories(categories.map(c => c.id === id ? updatedCategory : c));
        setToast({ message: 'Category updated.', type: 'success' });
    } catch(e) {
        setToast({ message: 'Failed to update category.', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteCategory = (category: Category) => {
       setConfirmation({
         title: "Delete Category",
         message: `Are you sure you want to delete "${category.name}"? This may affect existing products.`,
         onConfirm: async () => {
             setIsLoading(true);
             try {
                 await dataService.deleteCategory(category.id);
                 setCategories(categories.filter(c => c.id !== category.id));
                 setToast({ message: 'Category deleted.', type: 'success'});
             } catch(e) {
                 setToast({ message: 'Failed to delete category.', type: 'error'});
             } finally {
                 setIsLoading(false);
             }
         }
     })
  };
  
  const handleAddSubCategory = async (categoryId: string, subCategoryName: string) => {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return;
      const newSubcategories = [...(category.subcategories || []), subCategoryName];
      setIsLoading(true);
      try {
          const updatedCategory = await dataService.updateCategory(categoryId, { subcategories: newSubcategories });
          setCategories(categories.map(c => c.id === categoryId ? updatedCategory : c));
      } catch(e) {
          setToast({ message: 'Failed to add sub-category.', type: 'error'});
      } finally {
          setIsLoading(false);
      }
  };

  const handleDeleteSubCategory = async (categoryId: string, subCategoryName: string) => {
      const category = categories.find(c => c.id === categoryId);
      if (!category || !category.subcategories) return;
      const newSubcategories = category.subcategories.filter(s => s !== subCategoryName);
      setIsLoading(true);
      try {
          const updatedCategory = await dataService.updateCategory(categoryId, { subcategories: newSubcategories });
          setCategories(categories.map(c => c.id === categoryId ? updatedCategory : c));
      } catch(e) {
          setToast({ message: 'Failed to delete sub-category.', type: 'error'});
      } finally {
          setIsLoading(false);
      }
  };

  const handleAddRole = (role: Role) => {
      setRoles([...roles, role]);
      setToast({ message: 'Role created.', type: 'success' });
  };

  const handleUpdateRole = (role: Role) => {
      setRoles(roles.map(r => r.id === role.id ? role : r));
      setToast({ message: 'Role updated.', type: 'success' });
  };

  const handleDeleteRole = (roleId: string) => {
      setRoles(roles.filter(r => r.id !== roleId));
      setToast({ message: 'Role deleted.', type: 'success' });
  };

  const handleCreatePromotion = async (promo: Omit<Promotion, 'id' | 'usageCount' | 'status'>) => {
      setIsLoading(true);
      try {
          const newPromo = await dataService.createPromotion(promo);
          setPromotions([...promotions, newPromo]);
          setToast({ message: 'Promotion created successfully.', type: 'success' });
          navigateTo(AppView.ADMIN_PROMOTIONS);
      } catch (e) {
          setToast({ message: 'Failed to create promotion.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleDeletePromotion = async (id: string) => {
      setIsLoading(true);
      try {
          await dataService.deletePromotion(id);
          setPromotions(promotions.filter(p => p.id !== id));
          setToast({ message: 'Promotion deleted.', type: 'success' });
      } catch (e) {
          setToast({ message: 'Failed to delete promotion.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleSaveEmailConfig = async (config: EmailConfiguration) => {
      setIsLoading(true);
      try {
          await dataService.saveEmailSettings(config);
          setEmailSettings(config);
          setToast({ message: 'Email configuration saved.', type: 'success' });
      } catch (e) {
          setToast({ message: 'Failed to save settings.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleSendEmail = async (recipientGroup: string, subject: string, body: string, specificUserId?: string) => {
      setIsLoading(true);
      try {
          const logData = {
              date: new Date().toLocaleString(),
              recipientGroup,
              recipientEmail: specificUserId ? users.find(u => u.id === specificUserId)?.email : undefined,
              subject,
          };
          const newLog = await dataService.sendEmail(logData);
          setEmailLogs([newLog, ...emailLogs]);
          setToast({ message: 'Email sent successfully!', type: 'success' });
          navigateTo(AppView.ADMIN_EMAIL_COMPOSE); 
      } catch (e) {
          setToast({ message: 'Failed to send email.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleCreateCampaignGroup = async (name: string, userIds: string[], description?: string) => {
      setIsLoading(true);
      try {
          const newGroup = await dataService.createCampaignGroup({ name, userIds, description });
          setCampaignGroups([...campaignGroups, newGroup]);
          setToast({ message: 'Campaign group created.', type: 'success' });
      } catch (e) {
          setToast({ message: 'Failed to create group.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleDeleteCampaignGroup = async (id: string) => {
      setIsLoading(true);
      try {
          await dataService.deleteCampaignGroup(id);
          setCampaignGroups(campaignGroups.filter(g => g.id !== id));
          setToast({ message: 'Group deleted.', type: 'success' });
      } catch (e) {
          setToast({ message: 'Failed to delete group.', type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const value: AppContextState = {
      view, navigateTo, currentUser, isLoggedIn, isLoading, toast, setToast, confirmation, setConfirmation, criticalError, setCriticalError,
      users, products, orders, categories, disputes, notifications, transactions, kycFields, homepageContent, roles, promotions, emailSettings, emailLogs, chatSessions, campaignGroups,
      cart, cartCount, joiningUserType, setJoiningUserType, registrationEmail, postLoginAction, setPostLoginAction,
      selectedProduct, setSelectedProduct, selectedOrder, setSelectedOrder,
      selectedDispute, setSelectedDispute, selectedUserToEdit, setSelectedUserToEdit,
      selectedKycUser, setSelectedKycUser,
      searchQuery, setSearchQuery,
      loadInitialData,
      isChatWidgetOpen, activeChatSessionId, toggleChatWidget, handleStartSupportChat, handleSendChatMessage, handleResolveChat,
      handleLogin, handleLogout, handleRegister, completeRegistration, handleForgotPassword, handleSetNewPassword, finishOnboarding,
      handleAddToCart, handleUpdateCartQuantity, handleRemoveFromCart, handlePlaceOrder, handleConfirmDelivery, handleCreateDispute, handleUpdateOrderStatus,
      handleUpdateProfile, handleUpdatePassword, handleUpdateAddress, handleKycSubmit,
      handleAddProduct, handleUpdateProduct, handleDeleteProduct, handleRequestPayout,
      handleAddDisputeMessage, handleUpdateDisputeStatus,
      handleDeactivateUser, handleBulkDeactivateUsers, handleUpdateKycStatus, handleCreateUser, handleUpdateUser, handleUpdateKycFields, handleUpdateHomepageContent,
      handleAddCategory, handleUpdateCategory, handleDeleteCategory, handleAddSubCategory, handleDeleteSubCategory,
      handleBulkDeleteProducts,
      handleAddRole, handleUpdateRole, handleDeleteRole,
      handleCreatePromotion, handleDeletePromotion,
      handleSaveEmailConfig, handleSendEmail,
      handleCreateCampaignGroup, handleDeleteCampaignGroup,
      handleAddReview
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
