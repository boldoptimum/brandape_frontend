
import { User, Product, Order, Dispute, Notification, Transaction, Category, KycField, HomepageContent, CartItem, Promotion, EmailConfiguration, EmailLog, ChatSession, ChatMessage, CampaignGroup, Review } from '../types/index';
import { allImages } from '../assets/images';

// Fetch the JSON data in a browser-compatible way using top-level await
const response = await fetch('/backend/db.json');
const dbData = await response.json();

// In-memory database for test environment
let db = JSON.parse(JSON.stringify(dbData));

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getRandomImage = () => allImages[Math.floor(Math.random() * allImages.length)];

export const fileDataService = {
    // Read operations
    getCategories: async (): Promise<Category[]> => { await delay(50); return db.categories; },
    getDisputes: async (): Promise<Dispute[]> => { await delay(50); return db.disputes; },
    getHomepageContent: async (): Promise<HomepageContent> => { await delay(50); return db.homepageContent; },
    getKycFields: async (): Promise<{id: number, fields: KycField[]}> => { await delay(50); return db.kycFields; },
    getNotifications: async (): Promise<Notification[]> => { await delay(50); return db.notifications; },
    getOrders: async (): Promise<Order[]> => { await delay(50); return db.orders; },
    getOrder: async (id: string): Promise<Order | undefined> => { await delay(50); return db.orders.find((o: Order) => o.id === id); },
    getProducts: async (): Promise<Product[]> => { await delay(50); return db.products; },
    getTransactions: async (): Promise<Transaction[]> => { await delay(50); return db.transactions; },
    getUsers: async (): Promise<User[]> => { await delay(50); return db.users; },
    getPromotions: async (): Promise<Promotion[]> => { await delay(50); return db.promotions || []; },
    getEmailSettings: async (): Promise<EmailConfiguration> => { await delay(50); return db.emailSettings || {}; },
    getEmailLogs: async (): Promise<EmailLog[]> => { await delay(50); return db.emailLogs || []; },
    getChatSessions: async (): Promise<ChatSession[]> => { await delay(50); return db.chatSessions || []; },
    getCampaignGroups: async (): Promise<CampaignGroup[]> => { await delay(50); return db.campaignGroups || []; },

    // Auth
    login: async (email: string, password: string): Promise<User | null> => {
        await delay(200);
        const user = db.users.find((u: User) => u.email === email && u.password === password);
        return user || null;
    },

    // Write operations (in-memory)
    createUser: async (userData: Omit<User, 'id' | 'avatarUrl' | 'address' | 'phone' | 'registeredDate' | 'lastLogin' | 'status' | 'kycStatus'>): Promise<User> => {
        await delay(100);
        const newUser: User = { 
            id: `usr_new_${Date.now()}`,
            ...userData,
            avatarUrl: `/images/users/new_user.jpg`,
            address: { street: '', city: '', country: ''},
            phone: '', registeredDate: new Date().toISOString().split('T')[0],
            lastLogin: new Date().toISOString(), status: 'Active',
            kycStatus: 'Not Submitted'
        };
        db.users.push(newUser);
        return newUser;
    },
    updateUser: async (id: string, data: Partial<User>): Promise<User> => {
        await delay(100);
        const userIndex = db.users.findIndex((u: User) => u.id === id);
        if (userIndex > -1) {
            db.users[userIndex] = { ...db.users[userIndex], ...data };
            return db.users[userIndex];
        }
        throw new Error("User not found");
    },
    fullUpdateUser: async (user: User): Promise<User> => {
        await delay(100);
        const userIndex = db.users.findIndex((u: User) => u.id === user.id);
        if (userIndex > -1) {
            db.users[userIndex] = user;
            return db.users[userIndex];
        }
        throw new Error("User not found");
    },
    deleteUser: async (id: string): Promise<Record<string, never>> => {
        await delay(100);
        db.users = db.users.filter((u: User) => u.id !== id);
        return {};
    },
    updatePassword: async (email: string, password: string): Promise<void> => {
        await delay(100);
        const userIndex = db.users.findIndex((u: User) => u.email === email);
        if (userIndex > -1) {
            db.users[userIndex].password = password;
        } else {
            throw new Error('User not found');
        }
    },
    updateKycFields: async (fields: KycField[]): Promise<{id: number, fields: KycField[]}> => {
        await delay(100);
        db.kycFields.fields = fields;
        return db.kycFields;
    },
    updateHomepageContent: async (content: HomepageContent): Promise<HomepageContent> => {
        await delay(100);
        db.homepageContent = content;
        return db.homepageContent;
    },
    createProduct: async (productData: Omit<Product, 'id' | 'sales' | 'vendorId' | 'rating' | 'reviewCount' | 'reviews'>, vendorId: string): Promise<Product> => {
        await delay(100);
        const newProduct: Product = {
            id: `prod_new_${Date.now()}`,
            ...productData,
            vendorId, sales: 0, rating: 0, reviewCount: 0, reviews: [],
            imageUrl: productData.imageUrl || getRandomImage(),
        };
        db.products.push(newProduct);
        return newProduct;
    },
    updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
        await delay(100);
        const prodIndex = db.products.findIndex((p: Product) => p.id === id);
        if (prodIndex > -1) {
            db.products[prodIndex] = { ...db.products[prodIndex], ...data };
            return db.products[prodIndex];
        }
        throw new Error("Product not found");
    },
    deleteProduct: async (id: string): Promise<Record<string, never>> => {
        await delay(100);
        db.products = db.products.filter((p: Product) => p.id !== id);
        return {};
    },
    createOrder: async (cart: CartItem[], user: User, useEscrow: boolean, discount: number = 0, promoCode?: string): Promise<Order> => {
        await delay(100);
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // Shipping is flat 5000
        const total = Math.max(0, subtotal + 5000 - discount);
        
        const newOrder: Order = {
           id: `ord_new_${Date.now()}`,
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
       db.orders.push(newOrder);
       return newOrder;
    },
    updateOrder: async (id: string, data: Partial<Order>): Promise<Order> => {
        await delay(100);
        const orderIndex = db.orders.findIndex((o: Order) => o.id === id);
        if (orderIndex > -1) {
            db.orders[orderIndex] = { ...db.orders[orderIndex], ...data };
            return db.orders[orderIndex];
        }
        throw new Error("Order not found");
    },
    createDispute: async (orderId: string, reason: string, buyerName: string, vendorName: string): Promise<Dispute> => {
        await delay(100);
        const newDispute: Dispute = {
            id: `disp_new_${Date.now()}`,
            orderId, buyer: buyerName, vendor: vendorName, reason, status: 'Open',
            date: new Date().toISOString().split('T')[0],
            messages: [{ user: buyerName, text: `Dispute opened. Reason: ${reason}`, timestamp: new Date().toLocaleString() }]
        };
        db.disputes.push(newDispute);
        return newDispute;
    },
    updateDispute: async (id: string, data: Partial<Dispute>): Promise<Dispute> => {
        await delay(100);
        const disputeIndex = db.disputes.findIndex((d: Dispute) => d.id === id);
        if (disputeIndex > -1) {
            db.disputes[disputeIndex] = { ...db.disputes[disputeIndex], ...data };
            return db.disputes[disputeIndex];
        }
        throw new Error("Dispute not found");
    },
    createTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
        await delay(100);
        const newTransaction = { id: `trn_new_${Date.now()}`, ...transaction };
        db.transactions.push(newTransaction);
        return newTransaction;
    },
    createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
        await delay(100);
        const newCategory = { id: `cat_new_${Date.now()}`, ...category };
        db.categories.push(newCategory);
        return newCategory;
    },
    updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
        await delay(100);
        const catIndex = db.categories.findIndex((c: Category) => c.id === id);
        if (catIndex > -1) {
            db.categories[catIndex] = { ...db.categories[catIndex], ...data };
            return db.categories[catIndex];
        }
        throw new Error("Category not found");
    },
    deleteCategory: async (id: string): Promise<Record<string, never>> => {
        await delay(100);
        db.categories = db.categories.filter((c: Category) => c.id !== id);
        return {};
    },
    createPromotion: async (promo: Omit<Promotion, 'id' | 'usageCount' | 'status'>): Promise<Promotion> => {
        await delay(100);
        const newPromo: Promotion = { 
            id: `promo_${Date.now()}`, 
            ...promo, 
            usageCount: 0, 
            status: 'Active' 
        };
        db.promotions.push(newPromo);
        return newPromo;
    },
    deletePromotion: async (id: string): Promise<void> => {
        await delay(100);
        db.promotions = db.promotions.filter((p: Promotion) => p.id !== id);
    },
    saveEmailSettings: async (settings: EmailConfiguration): Promise<EmailConfiguration> => {
        await delay(100);
        db.emailSettings = settings;
        return settings;
    },
    sendEmail: async (log: Omit<EmailLog, 'id' | 'status'>): Promise<EmailLog> => {
        await delay(500); // Simulate sending time
        const newLog: EmailLog = {
            id: `email_${Date.now()}`,
            ...log,
            status: 'Sent'
        };
        db.emailLogs.unshift(newLog); // Add to beginning
        return newLog;
    },
    // Chat
    createChatSession: async (userId: string, userName: string, userType: any, initialMessage: string): Promise<ChatSession> => {
        await delay(100);
        const newSession: ChatSession = {
            id: `chat_${Date.now()}`,
            userId, userName, userType, status: 'Open',
            lastMessage: initialMessage, lastMessageDate: new Date().toISOString(),
            messages: [{
                id: `msg_${Date.now()}`, senderId: userId, senderName: userName, text: initialMessage, timestamp: new Date().toISOString(), isAdmin: false
            }],
            unreadCount: 1
        };
        
        if (!db.chatSessions) db.chatSessions = [];
        db.chatSessions.push(newSession);

        // Simulate agent reply
        setTimeout(() => {
            const replyMsg: ChatMessage = {
                id: `msg_auto_${Date.now()}`,
                senderId: 'agent_bot',
                senderName: 'Support Agent',
                text: "Hello! Thank you for contacting support. An agent will be with you shortly.",
                timestamp: new Date().toISOString(),
                isAdmin: true
            };
            newSession.messages.push(replyMsg);
            newSession.lastMessage = replyMsg.text;
            newSession.lastMessageDate = replyMsg.timestamp;
        }, 3000);

        return newSession;
    },
    updateChatSession: async (id: string, data: Partial<ChatSession>): Promise<ChatSession> => {
        await delay(50);
        if (!db.chatSessions) db.chatSessions = [];
        const index = db.chatSessions.findIndex((s: ChatSession) => s.id === id);
        if (index > -1) {
            db.chatSessions[index] = { ...db.chatSessions[index], ...data };
            return db.chatSessions[index];
        }
        throw new Error("Chat session not found");
    },

    // Reviews
    addReview: async (productId: string, review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
        await delay(100);
        const productIndex = db.products.findIndex((p: Product) => p.id === productId);
        if (productIndex === -1) throw new Error("Product not found");

        const newReview: Review = {
            id: `rev_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            ...review
        };

        const product = db.products[productIndex];
        product.reviews.push(newReview);
        // Recalculate stats
        product.reviewCount = product.reviews.length;
        product.rating = product.reviews.reduce((acc: number, r: Review) => acc + r.rating, 0) / product.reviewCount;

        return newReview;
    },

    // Campaign Groups
    createCampaignGroup: async (group: Omit<CampaignGroup, 'id'>): Promise<CampaignGroup> => {
        await delay(100);
        const newGroup: CampaignGroup = { id: `grp_${Date.now()}`, ...group };
        if(!db.campaignGroups) db.campaignGroups = [];
        db.campaignGroups.push(newGroup);
        return newGroup;
    },
    deleteCampaignGroup: async (id: string): Promise<void> => {
        await delay(100);
        if(!db.campaignGroups) return;
        db.campaignGroups = db.campaignGroups.filter((g: CampaignGroup) => g.id !== id);
    },
};
