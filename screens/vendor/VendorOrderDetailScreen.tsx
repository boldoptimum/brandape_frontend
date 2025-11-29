
import React from 'react';
import { AppView, OrderStatus } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import { useAppContext } from '../../hooks/useAppContext';

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Completed':
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Shipped': 
        case 'Ready for Pickup': return 'bg-blue-100 text-blue-800';
        case 'Processing':
        case 'Payment in Escrow':
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled': 
        case 'Disputed': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const VendorOrderDetailScreen: React.FC = () => {
    const { selectedOrder: order, navigateTo, handleUpdateOrderStatus } = useAppContext();
    
    const onBack = () => navigateTo(AppView.VENDOR_ORDERS);

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
    
    // Vendors only handle up to "Ready for Pickup". Freight handles the rest.
    const nextActionMap: Partial<Record<OrderStatus, OrderStatus>> = {
        'Payment in Escrow': 'Processing',
        'Processing': 'Ready for Pickup',
    };
    
    const nextActionText: Partial<Record<OrderStatus, string>> = {
        'Payment in Escrow': 'Start Processing',
        'Processing': 'Mark Ready for Pickup',
    }
    
    const nextStatus = nextActionMap[order.status];
    const nextStatusText = nextActionText[order.status];

    return (
        <DashboardLayout>
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to All Orders
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start border-b pb-4 mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Order #{order.id}</h2>
                            <p className="text-sm text-gray-500">Date: {order.date}</p>
                        </div>
                        <div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Customer Details</h4>
                             <p className="text-gray-800 font-medium">{order.customer}</p>
                             <p className="text-gray-600 text-sm">{order.shippingAddress.street}</p>
                             <p className="text-gray-600 text-sm">{`${order.shippingAddress.city}, ${order.shippingAddress.country}`}</p>
                        </div>
                         <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Payment Info</h4>
                            <p className="text-gray-800 font-medium">{order.paymentMethod}</p>
                            <p className={`text-sm font-semibold ${order.usedEscrow ? 'text-green-600' : 'text-yellow-600'}`}>{order.usedEscrow ? "Escrow Protected" : "Direct Payment"}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Items in Order</h3>
                        <ul className="divide-y divide-gray-200">
                            {order.items.map(item => (
                                <li key={item.id} className="py-4 flex items-center">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                    <div className="ml-4 flex-1">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">ID: {item.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">N {item.price.toLocaleString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-right">
                            <p className="text-gray-500">Order Total</p>
                            <p className="text-2xl font-bold text-gray-900">N {order.total.toLocaleString()}</p>
                        </div>
                        {nextStatus && nextStatusText ? (
                            <button onClick={() => handleUpdateOrderStatus(order.id, nextStatus)} className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700">
                                {nextStatusText}
                            </button>
                        ) : (
                            order.status === 'Ready for Pickup' && (
                                <div className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-2 rounded">
                                    Waiting for Logistics Provider
                                </div>
                            )
                        )}
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Tracking History</h3>
                    <div className="space-y-4">
                        {[...order.trackingHistory].reverse().map((event, index) => (
                            <div key={index} className="flex">
                                <div className="flex flex-col items-center mr-4">
                                    <div>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-300'}`}>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M20 10a10 10 0 11-20 0 10 10 0 0120 0z"></path></svg>
                                        </div>
                                    </div>
                                    {index < order.trackingHistory.length - 1 && <div className="w-px flex-grow bg-gray-300 h-full mt-1"></div>}
                                </div>
                                <div className="pb-4">
                                    <p className="font-semibold text-gray-800 text-sm">{event.status}</p>
                                    <p className="text-xs text-gray-500">{new Date(event.date).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VendorOrderDetailScreen;
