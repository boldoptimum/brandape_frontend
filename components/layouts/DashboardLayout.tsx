
import React, { useState, useRef } from 'react';
import BrandApeLogo from '../icons/BrandApeLogo';
import { User, AppView, Notification, UserType } from '../../types/index';
import NotificationIcon from '../icons/NotificationIcon';
import DashboardIcon from '../icons/DashboardIcon';
import ProductsIcon from '../icons/ProductsIcon';
import OrdersIcon from '../icons/OrdersIcon';
import CustomersIcon from '../icons/CustomersIcon';
import WalletIcon from '../icons/WalletIcon';
import SettingsIcon from '../icons/SettingsIcon';
import DisputesIcon from '../icons/DisputesIcon';
import KycIcon from '../icons/KycIcon';
import ContentIcon from '../icons/ContentIcon';
import CategoryIcon from '../icons/CategoryIcon';
import LogoutIcon from '../icons/LogoutIcon';
import CartIcon from '../icons/CartIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChatWidget from '../shared/ChatWidget';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useAppContext } from '../../hooks/useAppContext';

const KycBanner: React.FC<{user: User, onNavigate: (view: AppView) => void, onClose: () => void}> = ({user, onNavigate, onClose}) => {
    if (user.kycStatus === 'Verified' || user.kycStatus === 'Pending') return null;
    
    let message = 'Your account is not verified. Complete KYC to access all features.';
    if (user.kycStatus === 'Rejected') {
        message = `Your KYC submission was rejected: ${user.kycRejectionReason || 'No reason provided.'}`;
    }

    return (
        <div className="bg-yellow-100/80 backdrop-blur-sm border-b border-yellow-200 p-3 text-sm text-yellow-800">
            <div className="container mx-auto flex justify-between items-center">
                <p>{message}</p>
                <div className="flex items-center space-x-4">
                    <button onClick={() => onNavigate(AppView.KYC_SUBMISSION)} className="font-semibold underline">
                        {user.kycStatus === 'Not Submitted' ? 'Verify Now' : 'Resubmit'}
                    </button>
                    <button onClick={onClose} className="text-xl font-bold" aria-label="Close KYC banner">&times;</button>
                </div>
            </div>
        </div>
    )
}

// Nav link definitions
const vendorNavLinks = {
  dashboard: { view: AppView.VENDOR_DASHBOARD, label: 'Dashboard', icon: DashboardIcon },
  groups: [
    { group: 'Store', links: [
        { view: AppView.VENDOR_PRODUCTS, label: 'Products', icon: ProductsIcon },
        { view: AppView.VENDOR_ORDERS, label: 'Orders', icon: OrdersIcon },
        { view: AppView.VENDOR_CUSTOMERS, label: 'Customers', icon: CustomersIcon },
    ]},
    { group: 'Finance', links: [
        { view: AppView.VENDOR_WALLET, label: 'Wallet', icon: WalletIcon },
    ]},
    { group: 'Account', links: [
        { view: AppView.SETTINGS, label: 'Settings', icon: SettingsIcon },
    ]},
  ]
};

const buyerNavLinks = {
  dashboard: { view: AppView.BUYER_DASHBOARD, label: 'My Orders', icon: OrdersIcon },
  groups: [
    { group: 'Shop', links: [
        { view: AppView.BUYER_PRODUCTS, label: 'Browse Products', icon: ProductsIcon },
        { view: AppView.BUYER_CART, label: 'Shopping Cart', icon: CartIcon },
    ]},
    { group: 'Account', links: [
        { view: AppView.SETTINGS, label: 'Settings', icon: SettingsIcon },
    ]},
  ]
};

const supportNavLinks = {
  dashboard: { view: AppView.SUPPORT_DASHBOARD, label: 'Dashboard', icon: DashboardIcon },
  groups: [
    { group: 'Workspace', links: [
        { view: AppView.SUPPORT_LIVE_CHAT, label: 'Live Chat', icon: ContentIcon },
        { view: AppView.SUPPORT_DISPUTES, label: 'Disputes', icon: DisputesIcon },
    ]},
    { group: 'Account', links: [
        { view: AppView.SETTINGS, label: 'Settings', icon: SettingsIcon },
    ]},
  ]
};

const adminNavLinks = {
  dashboard: { view: AppView.ADMIN_DASHBOARD, label: 'Dashboard', icon: DashboardIcon },
  groups: [
    { group: 'Management', links: [
        { view: AppView.ADMIN_USERS, label: 'Users', icon: CustomersIcon },
        { view: AppView.ADMIN_ROLES, label: 'Roles', icon: SettingsIcon },
        { view: AppView.ADMIN_PRODUCTS, label: 'Products', icon: ProductsIcon },
        { view: AppView.ADMIN_ORDERS, label: 'Orders', icon: OrdersIcon },
        { view: AppView.ADMIN_CATEGORIES, label: 'Categories', icon: CategoryIcon },
        { view: AppView.ADMIN_PROMOTIONS, label: 'Promotions', icon: WalletIcon }, // Reusing WalletIcon for Promos
    ]},
    { group: 'Communication', links: [
        { view: AppView.ADMIN_EMAIL_COMPOSE, label: 'Compose Email', icon: NotificationIcon },
        { view: AppView.ADMIN_EMAIL_SETTINGS, label: 'Email Settings', icon: SettingsIcon },
    ]},
    { group: 'Platform', links: [
        { view: AppView.ADMIN_KYC_SUBMISSIONS, label: 'KYC Submissions', icon: KycIcon },
        { view: AppView.ADMIN_CONTENT_MANAGEMENT, label: 'Homepage Content', icon: ContentIcon },
        { view: AppView.ADMIN_INTEGRATIONS, label: 'Integrations', icon: SettingsIcon },
        { view: AppView.ADMIN_BRANDING, label: 'Branding', icon: ContentIcon },
    ]},
    { group: 'Account', links: [
        { view: AppView.SETTINGS, label: 'Settings', icon: SettingsIcon },
    ]},
  ]
};

const NavButton: React.FC<{
  view: AppView;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onNavigated?: () => void;
}> = ({ view, label, Icon, activeView, onNavigate, onNavigated }) => (
    <button
        onClick={() => {
            onNavigate(view);
            if (onNavigated) onNavigated();
        }}
        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-all duration-200 border-r-4 ${
            activeView === view
            ? 'text-emerald-700 bg-slate-100 border-emerald-600'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
        }`}
    >
        <Icon className={`h-5 w-5 mr-3 transition-colors ${activeView === view ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'}`} />
        <span>{label}</span>
    </button>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const DashboardLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { currentUser, navigateTo, handleLogout, view, notifications } = useAppContext();
  
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showKycBanner, setShowKycBanner] = useState(true);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  useClickOutside(notificationsRef, () => setNotificationOpen(false));
  
  const profileRef = useRef<HTMLDivElement>(null);
  useClickOutside(profileRef, () => setProfileOpen(false));
  
  if (!currentUser) return null; // Or a loading/error state

  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;
  const userNotifications = notifications.filter(n => n.userId === currentUser.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const isActionableUser = currentUser.type === UserType.BUYER || currentUser.type === UserType.VENDOR;

  const getNavLinks = () => {
    switch(currentUser.type) {
      case UserType.VENDOR: return vendorNavLinks;
      case UserType.BUYER: return buyerNavLinks;
      case UserType.SUPPORT_AGENT: return supportNavLinks;
      case UserType.SUPER_ADMIN: return adminNavLinks;
      // In a real app, custom roles would dynamically filter links based on permissions
      default: return { dashboard: null, groups: [] };
    }
  };
  const navConfig = getNavLinks();


  return (
    <div className="flex h-screen bg-slate-100">
      {/* Overlay for mobile nav */}
      {mobileNavOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
        ></div>
      )}
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white border-r border-slate-200 flex flex-col z-30 shadow-xl md:shadow-none`}>
        {/* Brand Area with Green Background */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-700 bg-emerald-600">
          <button onClick={() => navigateTo(AppView.HOME)}>
            <BrandApeLogo className="h-6 w-auto text-white" variant="light" />
          </button>
           <button onClick={() => setMobileNavOpen(false)} className="md:hidden text-emerald-100 hover:text-white" aria-label="Close navigation menu">
                <CloseIcon className="w-6 h-6" />
           </button>
        </div>
        
        <nav className="mt-6 flex-grow space-y-1 overflow-y-auto">
            {navConfig.dashboard && (
                <NavButton
                    view={navConfig.dashboard.view}
                    label={navConfig.dashboard.label}
                    Icon={navConfig.dashboard.icon}
                    activeView={view}
                    onNavigate={navigateTo}
                    onNavigated={() => setMobileNavOpen(false)}
                />
            )}
            
            <div className="py-2"></div>

            {navConfig.groups.map((group) => (
                <div key={group.group} className="mb-6">
                <h3 className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{group.group}</h3>
                <div className="space-y-1">
                    {group.links.map(({ view: linkView, label, icon: Icon }) => (
                        <NavButton
                            key={label}
                            view={linkView}
                            label={label}
                            Icon={Icon}
                            activeView={view}
                            onNavigate={navigateTo}
                            onNavigated={() => setMobileNavOpen(false)}
                        />
                    ))}
                </div>
                </div>
            ))}
        </nav>
         <div className="px-4 pb-6 pt-4 border-t border-slate-100">
            <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2.5 text-left text-sm font-medium rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
                <LogoutIcon className="h-5 w-5 mr-3" />
                <span>Logout</span>
            </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 sticky top-0">
          <div className="flex items-center">
            <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="text-slate-500 focus:outline-none md:hidden p-2 rounded-md hover:bg-slate-100 mr-2" aria-label="Open navigation menu">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-slate-800">
              Welcome, <span className="text-emerald-600">{currentUser.name.split(' ')[0]}</span>!
            </h1>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
             <div className="relative" ref={notificationsRef}>
                <button onClick={() => setNotificationOpen(prev => !prev)} className="relative p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                    <NotificationIcon className="h-5 w-5 text-slate-600" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">{unreadCount}</span>
                    )}
                </button>
                {notificationOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-20 animate-fade-in">
                        <div className="p-4 font-semibold text-sm text-slate-800 border-b flex justify-between items-center">
                            <span>Notifications</span>
                            {unreadCount > 0 && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                        {userNotifications.length > 0 ? userNotifications.map(notif => (
                            <div key={notif.id} className={`p-4 text-sm border-b hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-emerald-50/50' : ''}`}>
                                <p className="text-slate-800">{notif.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(notif.date).toLocaleString()}</p>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center">
                                <NotificationIcon className="h-8 w-8 mb-2 opacity-20" />
                                No new notifications.
                            </div>
                        )}
                        </div>
                    </div>
                )}
             </div>
            <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(prev => !prev)} className="flex items-center p-1 pr-2 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                    <img src={currentUser.avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full object-cover shadow-sm" />
                    <div className="ml-2 text-left hidden sm:block">
                        <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">{UserType[currentUser.type]}</p>
                    </div>
                    <ChevronDownIcon className="w-3 h-3 text-slate-400 ml-2" />
                </button>
                 {profileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-fade-in">
                        <button onClick={() => { navigateTo(AppView.SETTINGS); setProfileOpen(false); }} className="w-full text-left flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          <SettingsIcon className="w-4 h-4 mr-3 text-slate-400" />
                          Settings
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogoutIcon className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                    </div>
                )}
            </div>
          </div>
        </header>

        {/* KYC Banner */}
        {isActionableUser && showKycBanner && <KycBanner user={currentUser} onNavigate={navigateTo} onClose={() => setShowKycBanner(false)} />}

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-4 sm:p-6 scroll-smooth relative">
          {children}
          <ChatWidget />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
