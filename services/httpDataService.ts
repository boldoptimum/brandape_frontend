
import { apiClient } from './http';
import { User, Product, Order, Dispute, Notification, Transaction, Category, KycField, HomepageContent, CartItem, Promotion, EmailConfiguration, EmailLog, ChatSession, ChatMessage, CampaignGroup, Review } from '../types/index';
import { allImages } from '../assets/images';

// Helper to get a random image for new entities
const getRandomImage = () => allImages[Math.floor(Math.random() * allImages.length)];

export const httpDataService = {
    // Read operations
    getCategories: () => apiClient.get<Category[]>('categories'),
    getDisputes: () => apiClient.get<Dispute[]>('disputes'),
    getHomepageContent: () => apiClient.get<HomepageContent>('homepageContent'),
    getKycFields: () => apiClient.get<{id: number, fields: KycField[]}>('kycFields/1'),
    getNotifications: () => apiClient.get<Notification[]>('notifications'),
    getOrders: () => apiClient.get<Order[]>('orders'),
    getOrder: (id: string) => apiClient.get<Order>(`orders/${id}`),
    getProducts: () => apiClient.get<Product[]>('products'),
    getTransactions: () => apiClient.get<Transaction[]>('transactions'),
    getUsers: () => apiClient.get<User[]>('users'),
    getPromotions: () => apiClient.get<Promotion[]>('promotions'),
    getEmailSettings: () => apiClient.get<EmailConfiguration>('emailSettings'),
    getEmailLogs: () => apiClient.get<EmailLog[]>('emailLogs'),
    getChatSessions: () => apiClient.get<ChatSession[]>('chatSessions'),
    getChatSession: (id: string) => apiClient.get<ChatSession>(`chatSessions/${id}`),
    getCampaignGroups: () => apiClient.get<CampaignGroup[]>('campaignGroups'),

    // Auth
    login: async (email: string, password: string): Promise<User | null> => {
        const users = await apiClient.get<User[]>(`users?email=${email}&password=${password}`);
        return users.length > 0 ? users[0] : null;
    },

    // Write operations
    createUser: (userData: Omit<User, 'id' | 'avatarUrl' | 'address' | 'phone' | 'registeredDate' | 'lastLogin' | 'status' | 'kycStatus'>) => {
        const newUser: Omit<User, 'id'> = { 
            ...userData,
            avatarUrl: `/images/users/new_user.jpg`,
            address: { street: '', city: '', country: ''},
            phone: '', registeredDate: new Date().toISOString().split('T')[0],
            lastLogin: new Date().toISOString(), status: 'Active',
            kycStatus: 'Not Submitted'
        };
        return apiClient.post<User>('users', newUser);
    },
    updateUser: (id: string, data: Partial<User>) => apiClient.patch<User>(`users/${id}`, data),
    fullUpdateUser: (user: User) => apiClient.put<User>(`users/${user.id}`, user),
    deleteUser: (id: string) => apiClient.delete(`users/${id}`),
    updatePassword: async (email: string, password: string): Promise<void> => {
        const users = await apiClient.get<User[]>(`users?email=${email}`);
        if(users.length > 0) {
            await apiClient.patch(`users/${users[0].id}`, { password });
        } else {
            throw new Error('User not found');
        }
    },
    updateKycFields: (fields: KycField[]) => apiClient.put<{id: number, fields: KycField[]}>('kycFields/1', { id: 1, fields }),
    updateHomepageContent: (content: HomepageContent) => apiClient.put<HomepageContent>('homepageContent/1', content),

    createProduct: (productData: Omit<Product, 'id' | 'sales' | 'vendorId' | 'rating' | 'reviewCount' | 'reviews'>, vendorId: string) => {
        const newProduct: Omit<Product, 'id'> = {
            ...productData,
            vendorId, sales: 0, rating: 0, reviewCount: 0, reviews: [],
            imageUrl: productData.imageUrl || getRandomImage(),
        };
        return apiClient.post<Product>('products', newProduct);
    },
    updateProduct: (id: string, data: Partial<Product>) => apiClient.patch<Product>(`products/${id}`, data),
    deleteProduct: (id: string) => apiClient.delete(`products/${id}`),

    createOrder: (cart: CartItem[], user: User, useEscrow: boolean, discount: number = 0, promoCode?: string) => {
         const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
         const total = Math.max(0, subtotal + 5000 - discount);

         const newOrder: Omit<Order, 'id'> = {
            date: new Date().toISOString().split('T')[0], customer: user.name, customerId: user.id,
            total: total,
            subtotal: subtotal,
            discount: discount,
            promoCode: promoCode,
            status: useEscrow ? 'Payment in Escrow' : 'Pending', items: cart, shippingAddress: user.address,
            paymentMethod: 'Card **** 1234', usedEscrow: useEscrow,
            trackingHistory: [
                { status: 'Order Placed', date: new Date().toISOString(), location: 'Online Store' },
                { status: useEscrow ? 'Payment in Escrow' : 'Pending', date: new Date().toISOString() }
            ]
        };
        return apiClient.post<Order>('orders', newOrder);
    },
    updateOrder: (id: string, data: Partial<Order>) => apiClient.patch<Order>(`orders/${id}`, data),

    createDispute: (orderId: string, reason: string, buyerName: string, vendorName: string) => {
        const newDispute: Omit<Dispute, 'id'> = {
            orderId, buyer: buyerName, vendor: vendorName, reason, status: 'Open',
            date: new Date().toISOString().split('T')[0],
            messages: [{ user: buyerName, text: `Dispute opened. Reason: ${reason}`, timestamp: new Date().toLocaleString() }]
        };
        return apiClient.post<Dispute>('disputes', newDispute);
    },
    updateDispute: (id: string, data: Partial<Dispute>) => apiClient.patch<Dispute>(`disputes/${id}`, data),

    createTransaction: (transaction: Omit<Transaction, 'id'>) => apiClient.post<Transaction>('transactions', transaction),
    
    createCategory: (category: Omit<Category, 'id'>) => apiClient.post<Category>('categories', category),
    updateCategory: (id: string, data: Partial<Category>) => apiClient.patch<Category>(`categories/${id}`, data),
    deleteCategory: (id: string) => apiClient.delete(`categories/${id}`),

    createPromotion: (promo: Omit<Promotion, 'id' | 'usageCount' | 'status'>) => {
        const newPromo: Omit<Promotion, 'id'> = { ...promo, usageCount: 0, status: 'Active' };
        return apiClient.post<Promotion>('promotions', newPromo);
    },
    deletePromotion: (id: string) => apiClient.delete(`promotions/${id}`),
    
    saveEmailSettings: (settings: EmailConfiguration) => apiClient.post<EmailConfiguration>('emailSettings', settings),
    sendEmail: (log: Omit<EmailLog, 'id' | 'status'>) => {
        const newLog: Omit<EmailLog, 'id'> = { ...log, status: 'Sent' };
        return apiClient.post<EmailLog>('emailLogs', newLog);
    },

    // Chat
    createChatSession: (userId: string, userName: string, userType: any, initialMessage: string) => {
        const newSession: Omit<ChatSession, 'id'> = {
            userId, userName, userType, status: 'Open',
            lastMessage: initialMessage, lastMessageDate: new Date().toISOString(),
            messages: [{
                id: `msg_${Date.now()}`, senderId: userId, senderName: userName, text: initialMessage, timestamp: new Date().toISOString(), isAdmin: false
            }],
            unreadCount: 1
        };
        return apiClient.post<ChatSession>('chatSessions', newSession);
    },
    updateChatSession: (id: string, data: Partial<ChatSession>) => apiClient.patch<ChatSession>(`chatSessions/${id}`, data),

    // Reviews
    addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => {
        // In a real API, the backend would handle adding the review to the product and updating the average rating
        // Here we simulate by just returning the review object, but in file service we do the actual array manipulation
        return apiClient.post<Review>(`products/${productId}/reviews`, { ...review, date: new Date().toISOString() });
    },

    // Campaign Groups
    createCampaignGroup: (group: Omit<CampaignGroup, 'id'>) => apiClient.post<CampaignGroup>('campaignGroups', group),
    deleteCampaignGroup: (id: string) => apiClient.delete(`campaignGroups/${id}`),
};
