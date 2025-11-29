
import React, { useState } from 'react';
import { AppView, OrderStatus, Product } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import Modal from '../../components/shared/Modal';
import ReviewModal from '../../components/shared/ReviewModal';
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
        default: return 'bg-slate-100 text-slate-800';
    }
};

const BuyerOrderDetailScreen: React.FC = () => {
    const { selectedOrder: order, navigateTo, handleCreateDispute, handleConfirmDelivery, handleAddReview, currentUser } = useAppContext();
    const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
    const [disputeReason, setDisputeReason] = useState('');
    
    // Review State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewProductId, setReviewProductId] = useState<string | null>(null);
    const [reviewProductName, setReviewProductName] = useState('');
    
    const onBack = () => navigateTo(AppView.BUYER_DASHBOARD);
    
    if (!order) {
        return (
            <DashboardLayout>
                <div className="text-center bg-white p-8 rounded shadow">
                    <h2 className="text-xl font-semibold text-slate-700">Order Not Found</h2>
                    <p className="text-slate-500 mt-2">The selected order could not be found. Please go back and try again.</p>
                    <button onClick={onBack} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded font-medium">
                        Back to Orders
                    </button>
                </div>
            </DashboardLayout>
        );
    }
    
    const handleDisputeSubmit = () => {
        if (disputeReason.trim()) {
            handleCreateDispute(order.id, disputeReason);
            setIsDisputeModalOpen(false);
            setDisputeReason('');
        }
    };

    const openReviewModal = (item: Product) => {
        const alreadyReviewed = item.reviews?.some(r => r.userId === currentUser?.id);
        if(alreadyReviewed) {
            alert("You have already reviewed this item.");
            return;
        }
        setReviewProductId(item.id);
        setReviewProductName(item.name);
        setIsReviewModalOpen(true);
    };

    const submitReview = (rating: number, comment: string) => {
        if (reviewProductId) {
            handleAddReview(reviewProductId, rating, comment);
        }
    };

    return (
        <DashboardLayout>
            {/* Dispute Modal */}
            <Modal isOpen={isDisputeModalOpen} onClose={() => setIsDisputeModalOpen(false)} title="Create a Dispute">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">Please provide a reason for opening a dispute for Order ID: <span className="font-semibold">{order.id}</span>.</p>
                    <div>
                        <label htmlFor="disputeReason" className="block text-sm font-medium text-slate-700">Reason</label>
                        <textarea 
                            id="disputeReason" 
                            rows={4} 
                            value={disputeReason}
                            onChange={(e) => setDisputeReason(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white"
                            placeholder="e.g., Item not as described, damaged on arrival, etc."
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button onClick={() => setIsDisputeModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300">Cancel</button>
                        <button onClick={handleDisputeSubmit} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Submit Dispute</button>
                    </div>
                </div>
            </Modal>

            {/* Review Modal */}
            <ReviewModal 
                isOpen={isReviewModalOpen} 
                onClose={() => setIsReviewModalOpen(false)} 
                onSubmit={submitReview}
                productName={reviewProductName}
            />
        
            <button onClick={onBack} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Order History
            </button>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded shadow border border-slate-100">
                    <div className="flex justify-between items-start border-b pb-4 mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Order #{order.id}</h2>
                            <p className="text-sm text-slate-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">Items Ordered</h3>
                        <ul className="divide-y divide-slate-200">
                            {order.items.map(item => (
                                <li key={item.id} className="py-4 flex items-center">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    <div className="ml-4 flex-1">
                                        <p className="font-medium text-slate-800">{item.name}</p>
                                        <p className="text-sm text-slate-500">{item.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-slate-800">N {item.price.toLocaleString()}</p>
                                        {(order.status === 'Completed' || order.status === 'Delivered') && (
                                            <button 
                                                onClick={() => openReviewModal(item)}
                                                className="text-xs text-emerald-600 hover:underline mt-1 block w-full text-right font-medium"
                                            >
                                                Leave Review
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t gap-4">
                        <div className="text-right flex-1">
                            <p className="text-slate-500">Total</p>
                            <p className="text-2xl font-bold text-slate-900">N {order.total.toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-2">
                             {(order.status === 'Delivered' || order.status === 'Shipped') && (
                                <button onClick={() => handleConfirmDelivery(order.id)} className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">Confirm Delivery</button>
                            )}
                            {(order.status !== 'Cancelled' && order.status !== 'Completed' && order.status !== 'Disputed' && order.status !== 'Refunded') && (
                                <button onClick={() => setIsDisputeModalOpen(true)} className="px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">Create Dispute</button>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded shadow border border-slate-100 h-fit">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                        Tracking History
                    </h3>
                    
                    {order.trackingNumber && (
                        <div className="mb-4 p-3 bg-slate-50 rounded text-sm">
                            <p className="text-slate-500">Tracking Number:</p>
                            <p className="font-mono font-bold text-slate-800">{order.trackingNumber}</p>
                        </div>
                    )}

                    <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                        {[...order.trackingHistory].reverse().map((event, index) => (
                            <div key={index} className="ml-6 relative">
                                <span className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${index === 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                    {index === 0 ? (
                                        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <div className="h-2 w-2 rounded-full bg-white"></div>
                                    )}
                                </span>
                                <div className="flex flex-col">
                                    <p className={`text-sm font-semibold ${index === 0 ? 'text-emerald-700' : 'text-slate-700'}`}>{event.status}</p>
                                    <p className="text-xs text-slate-500">{new Date(event.date).toLocaleString()}</p>
                                    {event.location && (
                                        <p className="text-xs text-slate-600 mt-1 flex items-center">
                                            <svg className="w-3 h-3 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {event.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BuyerOrderDetailScreen;
