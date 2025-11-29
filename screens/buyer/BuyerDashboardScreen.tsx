
import React, { useState, useMemo } from 'react';
import { AppView, Order } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatCard from '../../components/shared/StatCard';
import BarChart from '../../components/shared/BarChart';
import OrdersIcon from '../../components/icons/OrdersIcon';
import WalletIcon from '../../components/icons/WalletIcon';
import ContentIcon from '../../components/icons/ContentIcon';
import { useAppContext } from '../../hooks/useAppContext';

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Delivered':
        case 'Completed': 
            return 'bg-green-100 text-green-800';
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Pending': 
        case 'Payment in Escrow':
            return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const BuyerDashboardScreen: React.FC = () => {
    const { currentUser, orders, products, setSelectedOrder, navigateTo } = useAppContext();
    const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
    
    if (!currentUser) return null;

    const onViewOrder = (order: Order) => {
      setSelectedOrder(order);
      navigateTo(AppView.BUYER_ORDER_DETAIL);
    };

    const userOrders = orders.filter(order => order.customerId === currentUser.id);
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    const completedOrders = userOrders.filter(o => o.status === 'Completed' || o.status === 'Delivered').length;

    // Calculate spend per month for chart
    const spendByMonth = userOrders.reduce((acc, order) => {
        const month = new Date(order.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + order.total;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(spendByMonth).map(month => ({
        label: month,
        value: spendByMonth[month]
    }));

    // User's Reviews
    const myReviews = useMemo(() => {
        return products.flatMap(p => 
            p.reviews
                .filter(r => r.userId === currentUser.id)
                .map(r => ({ ...r, productName: p.name, productImage: p.imageUrl }))
        ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [products, currentUser.id]);

    return (
        <DashboardLayout>
            <div className="mb-6 flex space-x-4 border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('overview')} 
                    className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${activeTab === 'overview' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('reviews')} 
                    className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    My Reviews ({myReviews.length})
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <StatCard title="Total Orders" value={userOrders.length.toString()} icon={OrdersIcon} />
                        <StatCard title="Total Amount Spent" value={`N ${totalSpent.toLocaleString()}`} icon={WalletIcon} />
                        <StatCard title="Completed Orders" value={completedOrders.toString()} icon={OrdersIcon} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 bg-white shadow rounded overflow-hidden p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Order History</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-500">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Order ID</th>
                                            <th scope="col" className="px-6 py-3">Date</th>
                                            <th scope="col" className="px-6 py-3">Items</th>
                                            <th scope="col" className="px-6 py-3">Total</th>
                                            <th scope="col" className="px-6 py-3">Status</th>
                                            <th scope="col" className="px-6 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userOrders.slice(0, 5).map((order) => (
                                            <tr key={order.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                                    {order.id}
                                                </th>
                                                <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">{order.items.length}</td>
                                                <td className="px-6 py-4 font-semibold">N {order.total.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button onClick={() => onViewOrder(order)} className="font-medium text-emerald-600 hover:underline">View Details</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {userOrders.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center py-4">No orders yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="lg:col-span-1 h-80">
                            <BarChart data={chartData.length > 0 ? chartData : [{label: 'No Data', value: 0}]} title="Monthly Spend Analysis" />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'reviews' && (
                <div className="animate-fade-in bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
                        <ContentIcon className="w-5 h-5 mr-2 text-emerald-600" />
                        Product Reviews
                    </h2>
                    {myReviews.length > 0 ? (
                        <div className="space-y-6">
                            {myReviews.map(review => (
                                <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6 flex gap-4">
                                    <img src={review.productImage} alt={review.productName} className="w-16 h-16 rounded object-cover border border-slate-200" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-slate-900">{review.productName}</h3>
                                            <span className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center my-1">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-slate-200'}`} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <p>You haven't submitted any reviews yet.</p>
                            <p className="text-sm mt-1">Review your purchased items from the Order Details page.</p>
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
};

export default BuyerDashboardScreen;
