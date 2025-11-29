
import React, { useState } from 'react';
import { AppView, Order, OrderStatus } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import { useAppContext } from '../../hooks/useAppContext';

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Completed':
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Payment in Escrow':
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled': 
        case 'Refunded':
        case 'Disputed': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const AdminOrderDetailScreen: React.FC = () => {
    const { selectedOrder: order, navigateTo, handleUpdateOrderStatus } = useAppContext();
    const [trackingLocation, setTrackingLocation] = useState('');
    const [trackingStatus, setTrackingStatus] = useState<OrderStatus | ''>('');
    
    const onBack = () => navigateTo(AppView.ADMIN_ORDERS);
    
    if (!order) {
        return (
            <DashboardLayout>
                <div className="text-center bg-white p-8 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-700">Order Not Found</h2>
                    <button onClick={onBack} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium">
                        Back to Orders
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const handleLogisticsUpdate = () => {
        if(trackingStatus) {
            // This would normally call an endpoint that also updates history with location
            handleUpdateOrderStatus(order.id, trackingStatus, trackingLocation); 
            // Note: In a real app we'd pass the location too
            setTrackingLocation('');
            setTrackingStatus('');
        }
    };

    return (
        <DashboardLayout>
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to All Orders
            </button>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start border-b pb-4 mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Order #{order.id}</h2>
                                <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Items Ordered</h3>
                            <ul className="divide-y divide-gray-200">
                                {order.items.map(item => (
                                    <li key={item.id} className="py-4 flex items-center">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div className="ml-4 flex-1">
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-800">N {item.price.toLocaleString()}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="flex justify-end items-center pt-4 border-t gap-4">
                            <div className="text-right">
                                <p className="text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">N {order.total.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Logistics Integration Panel */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Logistics & Freight Integration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Update Status</label>
                                <select 
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm sm:text-sm bg-white"
                                    value={trackingStatus}
                                    onChange={(e) => setTrackingStatus(e.target.value as OrderStatus)}
                                >
                                    <option value="">Select Status...</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Arrived at Terminal">Arrived at Terminal</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Location (Terminal)</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm sm:text-sm bg-white"
                                    placeholder="e.g. Lagos Port Terminal A"
                                    value={trackingLocation}
                                    onChange={(e) => setTrackingLocation(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs text-slate-500">Simulate API update from Freight Provider</span>
                            <button 
                                onClick={handleLogisticsUpdate}
                                disabled={!trackingStatus}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
                            >
                                Update Tracking
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Tracking</h3>
                    <div className="space-y-4 relative">
                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                        {[...order.trackingHistory].reverse().map((event, index) => (
                            <div key={index} className="flex relative z-10">
                                <div className="flex flex-col items-center mr-4">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white ${index === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-300'}`}>
                                        {index === 0 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <p className="font-semibold text-gray-800 text-sm">{event.status}</p>
                                    <p className="text-xs text-gray-500">{new Date(event.date).toLocaleString()}</p>
                                    {event.location && <p className="text-xs text-slate-600 mt-1 italic">📍 {event.location}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminOrderDetailScreen;
