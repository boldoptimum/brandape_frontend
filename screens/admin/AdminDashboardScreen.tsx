
import React from 'react';
import { AppView, User, UserType } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StatCard from '../../components/shared/StatCard';
import BarChart from '../../components/shared/BarChart';
import ProductsIcon from '../../components/icons/ProductsIcon';
import OrdersIcon from '../../components/icons/OrdersIcon';
import CustomersIcon from '../../components/icons/CustomersIcon';
import WalletIcon from '../../components/icons/WalletIcon';
import { useAppContext } from '../../hooks/useAppContext';


const getUserTypeString = (type: UserType) => {
    switch (type) {
        case UserType.BUYER: return 'Buyer';
        case UserType.VENDOR: return 'Vendor';
        case UserType.SUPPORT_AGENT: return 'Support';
        case UserType.SUPER_ADMIN: return 'Admin';
        default: return 'Unknown';
    }
};

const getUserTypeClass = (type: UserType) => {
    switch (type) {
        case UserType.BUYER: return 'bg-blue-100 text-blue-800';
        case UserType.VENDOR: return 'bg-green-100 text-green-800';
        case UserType.SUPPORT_AGENT: return 'bg-yellow-100 text-yellow-800';
        case UserType.SUPER_ADMIN: return 'bg-purple-100 text-purple-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}

const AdminDashboardScreen: React.FC = () => {
    const { users, products, orders, transactions } = useAppContext();
    
    // Calculate total volume (Gross Merchandise Value)
    const totalVolume = orders.reduce((sum, order) => order.status !== 'Cancelled' ? sum + order.total : sum, 0);
    // Approximate Commission (e.g., 5% of Completed orders)
    const totalCommission = transactions.filter(t => t.type === 'Fee').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;
    
    const userTypeData = [
        { label: 'Buyers', value: users.filter(u => u.type === UserType.BUYER).length },
        { label: 'Vendors', value: users.filter(u => u.type === UserType.VENDOR).length },
        { label: 'Support', value: users.filter(u => u.type === UserType.SUPPORT_AGENT).length },
        { label: 'Admins', value: users.filter(u => u.type === UserType.SUPER_ADMIN).length },
    ];

    // Revenue Growth Mock
    const revenueData = [
        { label: 'Jan', value: 150000 },
        { label: 'Feb', value: 180000 },
        { label: 'Mar', value: 210000 },
        { label: 'Apr', value: 190000 },
        { label: 'May', value: 300000 },
        { label: 'Jun', value: totalCommission || 350000 },
    ];

    return (
        <DashboardLayout>
            <div>
                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Platform Revenue" value={`N ${Intl.NumberFormat().format(totalCommission)}`} icon={WalletIcon} change="+15%" changeType="increase" />
                    <StatCard title="Total GMV" value={`N ${Intl.NumberFormat().format(totalVolume)}`} icon={WalletIcon} />
                    <StatCard title="Total Products" value={totalProducts.toString()} icon={ProductsIcon} />
                    <StatCard title="Total Users" value={totalUsers.toString()} icon={CustomersIcon} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                     {/* Revenue Chart */}
                    <div className="h-80">
                        <BarChart data={revenueData} title="Commission Revenue Growth" />
                    </div>
                     {/* User Type Distribution */}
                    <div className="h-80">
                        <BarChart data={userTypeData} title="User Distribution" />
                    </div>
                </div>

                {/* User List */}
                <div className="mt-8 bg-white p-6 rounded shadow border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Users</h3>
                        <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">User Type</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                                <tbody>
                                {users.slice(0, 5).map(u => (
                                    <tr key={u.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center space-x-3">
                                            <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full" />
                                            <span>{u.name}</span>
                                        </td>
                                        <td className="px-6 py-4">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUserTypeClass(u.type)}`}>
                                                {getUserTypeString(u.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">{u.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default AdminDashboardScreen;
