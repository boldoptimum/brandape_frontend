
import React from 'react';
import { AppView } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatCard from '../../components/shared/StatCard';
import BarChart from '../../components/shared/BarChart';
import WalletIcon from '../../components/icons/WalletIcon';
import OrdersIcon from '../../components/icons/OrdersIcon';
import ProductsIcon from '../../components/icons/ProductsIcon';
import { useAppContext } from '../../hooks/useAppContext';

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const VendorDashboardScreen: React.FC = () => {
    const { products, orders, navigateTo } = useAppContext();

    const totalRevenue = orders.reduce((sum, order) => order.status === 'Completed' || order.status === 'Delivered' ? sum + order.total : sum, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    
    // Low stock items
    const lowStockItems = products.filter(p => p.stock < 20);

    // Review Logic
    const allReviews = products.flatMap(p => p.reviews);
    const avgRating = allReviews.length > 0 
        ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length 
        : 0;

    // Sales data simulation based on orders
    const salesByMonth = orders.reduce((acc, order) => {
        const month = new Date(order.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + order.total;
        return acc;
    }, {} as Record<string, number>);

    const salesData = Object.keys(salesByMonth).length > 0 
        ? Object.keys(salesByMonth).map(month => ({ label: month, value: salesByMonth[month] }))
        : [
            { label: 'Jan', value: 120000 },
            { label: 'Feb', value: 180000 },
            { label: 'Mar', value: 150000 },
            { label: 'Apr', value: 210000 },
            { label: 'May', value: 250000 },
            { label: 'Jun', value: 230000 },
        ];

    return (
        <DashboardLayout>
            <div>
                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Revenue" value={`N ${Intl.NumberFormat().format(totalRevenue)}`} change="12.5%" changeType="increase" icon={WalletIcon} />
                    <StatCard title="Total Orders" value={totalOrders.toString()} change="2.3%" changeType="increase" icon={OrdersIcon} />
                    <StatCard title="Total Products" value={totalProducts.toString()} icon={ProductsIcon} />
                    <StatCard title="Avg Rating" value={avgRating.toFixed(1)} icon={StarIcon} change={`${allReviews.length} reviews`} changeType="increase" />
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Chart */}
                    <div className="lg:col-span-2 h-80">
                         <BarChart data={salesData} title="Sales Analytics" />
                    </div>
                    {/* Top Products */}
                    <div className="bg-white p-6 rounded shadow border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">Recent Reviews</h3>
                        </div>
                        <ul className="space-y-4 max-h-64 overflow-y-auto">
                            {allReviews.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map(rev => (
                                <li key={rev.id} className="pb-3 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center mb-1">
                                        <div className="flex text-yellow-400 text-xs">
                                            {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`} />)}
                                        </div>
                                        <span className="text-xs text-slate-400 ml-auto">{rev.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 italic">"{rev.comment}"</p>
                                    <p className="text-xs text-slate-500 mt-1">- {rev.userName}</p>
                                </li>
                            ))}
                            {allReviews.length === 0 && <p className="text-slate-500 text-sm italic">No reviews yet.</p>}
                        </ul>
                    </div>
                </div>

                {/* Lower Section: Orders & Low Stock */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* Recent Orders */}
                    <div className="bg-white p-6 rounded shadow border border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Orders</h3>
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">ID</th>
                                        <th scope="col" className="px-4 py-3">Customer</th>
                                        <th scope="col" className="px-4 py-3">Total</th>
                                        <th scope="col" className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map(order => (
                                        <tr key={order.id} className="bg-white border-b hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium">{order.id}</td>
                                            <td className="px-4 py-3 truncate max-w-[100px]">{order.customer}</td>
                                            <td className="px-4 py-3">N{order.total.toLocaleString()}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-white p-6 rounded shadow border border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            Inventory Alerts
                            {lowStockItems.length > 0 && <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">{lowStockItems.length} Low</span>}
                        </h3>
                        <div className="overflow-y-auto max-h-64">
                            {lowStockItems.length > 0 ? (
                                <table className="w-full text-sm text-left text-slate-500">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-2">Product</th>
                                            <th className="px-4 py-2">Stock</th>
                                            <th className="px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lowStockItems.map(p => (
                                            <tr key={p.id} className="border-b">
                                                <td className="px-4 py-2 font-medium text-slate-900">{p.name}</td>
                                                <td className="px-4 py-2 text-red-600 font-bold">{p.stock}</td>
                                                <td className="px-4 py-2">
                                                    <button onClick={() => navigateTo(AppView.VENDOR_ADD_EDIT_PRODUCT)} className="text-emerald-600 hover:underline text-xs">Restock</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-slate-500 text-center py-8">Inventory levels look good.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VendorDashboardScreen;
