

import React, { useState } from 'react';
import { AppView, Order } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import Modal from '../../components/shared/Modal';
import { useAppContext } from '../../hooks/useAppContext';

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Resolved': return 'bg-green-100 text-green-800';
        case 'In Progress': return 'bg-blue-100 text-blue-800';
        case 'Open': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const SupportDisputeDetailScreen: React.FC = () => {
    const { 
        currentUser, navigateTo, orders,
        selectedDispute: dispute,
        handleAddDisputeMessage, 
        handleUpdateDisputeStatus
    } = useAppContext();
    
    const [newMessage, setNewMessage] = useState('');
    const [currentStatus, setCurrentStatus] = useState(dispute?.status || 'Open');
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
    const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
    const [partialPercentage, setPartialPercentage] = useState<number | ''>('');
    
    const order = orders.find(o => o.id === dispute?.orderId);

    const handleSendMessage = () => {
        if (newMessage.trim() === '' || !dispute || !currentUser) return;
        const message = {
            user: currentUser.name,
            text: newMessage,
            timestamp: new Date().toLocaleString()
        };
        handleAddDisputeMessage(dispute.id, message);
        setNewMessage('');
    };
    
    const handleResolve = (resolutionAction: {type: 'refund', amount?: number} | {type: 'release'}) => {
        if (!dispute) return;
        setCurrentStatus('Resolved');
        handleUpdateDisputeStatus(dispute.id, 'Resolved', resolutionAction);
        setIsRefundModalOpen(false);
        setIsReleaseModalOpen(false);
    };

    if (!dispute || !order || !currentUser) {
        return (
             <DashboardLayout>
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-700">Dispute not found</h2>
                    <p className="text-gray-500 mt-2">Please go back and select a dispute to view.</p>
                    <button onClick={() => navigateTo(AppView.SUPPORT_DISPUTES)} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
                        Back to Disputes
                    </button>
                </div>
            </DashboardLayout>
        );
    }
    
    const onBack = () => navigateTo(AppView.SUPPORT_DISPUTES);
    
    return (
        <DashboardLayout>
            <Modal isOpen={isRefundModalOpen} onClose={() => setIsRefundModalOpen(false)} title={`Refund for Order #${order.id}`}>
                <div>
                    <div className="space-y-4">
                        <p className="text-sm">Select refund type. The total order value is <span className="font-bold">N{order.total.toLocaleString()}</span>.</p>
                        <fieldset className="flex gap-4">
                            <div className="flex items-center">
                                <input id="full_refund" type="radio" value="full" checked={refundType === 'full'} onChange={() => setRefundType('full')} className="h-4 w-4 text-emerald-600 border-gray-300"/>
                                <label htmlFor="full_refund" className="ml-2 block text-sm font-medium text-gray-700">Full Refund</label>
                            </div>
                            <div className="flex items-center">
                                <input id="partial_refund" type="radio" value="partial" checked={refundType === 'partial'} onChange={() => setRefundType('partial')} className="h-4 w-4 text-emerald-600 border-gray-300"/>
                                <label htmlFor="partial_refund" className="ml-2 block text-sm font-medium text-gray-700">Partial Refund</label>
                            </div>
                        </fieldset>
                        {refundType === 'partial' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Refund Percentage (%)</label>
                                <input 
                                    type="number" 
                                    value={partialPercentage} 
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '') {
                                            setPartialPercentage('');
                                        } else {
                                            const numValue = parseInt(value, 10);
                                            if (!isNaN(numValue)) {
                                                setPartialPercentage(Math.max(0, Math.min(100, numValue)));
                                            }
                                        }
                                    }} 
                                    max={100}
                                    min={0}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                                    placeholder="e.g., 50 for 50%" 
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => setIsRefundModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button 
                            onClick={() => handleResolve({type: 'refund', amount: refundType === 'full' ? order.total : (Number(partialPercentage) || 0) / 100 * order.total})}
                            disabled={refundType === 'partial' && (partialPercentage === '' || partialPercentage <= 0)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400">
                            Confirm Refund
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isReleaseModalOpen} onClose={() => setIsReleaseModalOpen(false)} title="Confirm Payment Release">
                <div>
                    <p className="text-sm">Are you sure you want to release the payment of <span className="font-bold">N{order.total.toLocaleString()}</span> to the vendor for Order #{order.id}? This action is final.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => setIsReleaseModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button onClick={() => handleResolve({type: 'release'})} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Confirm Release</button>
                    </div>
                </div>
            </Modal>
            <div>
                <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to Disputes
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main chat/timeline */}
                    <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6 flex flex-col h-[75vh]">
                        <div className="border-b pb-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Case ID: {dispute.id}</h2>
                            <p className="text-sm text-gray-500">Order ID: {dispute.orderId} | Reason: {dispute.reason}</p>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
                            {dispute.messages.map((message, index) => (
                                <div key={index} className={`flex items-start gap-3 ${message.user === currentUser.name ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white ${message.user === dispute.buyer ? 'bg-blue-500' : message.user === dispute.vendor ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                        {message.user.charAt(0)}
                                    </div>
                                    <div className={`p-3 rounded-lg max-w-md ${message.user === currentUser.name ? 'bg-emerald-500 text-white' : 'bg-gray-100'}`}>
                                        <p className="text-sm font-semibold">{message.user}</p>
                                        <p className="text-sm break-words">{message.text}</p>
                                        <p className="text-xs text-gray-400 mt-1 text-right">{message.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t">
                             <div className="relative">
                                <textarea
                                    className="w-full p-3 pr-28 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                                    rows={3}
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                                ></textarea>
                                <button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm font-medium">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dispute Details Panel */}
                    <div className="bg-white shadow-md rounded-lg p-6 h-fit">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Dispute Details</h3>
                        <div className="space-y-3 mt-4 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Status:</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(dispute.status)}`}>
                                    {dispute.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Opened:</span>
                                <span className="font-medium text-gray-800">{dispute.date}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-500">Buyer:</span>
                                <span className="font-medium text-gray-800">{dispute.buyer}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-500">Vendor:</span>
                                <span className="font-medium text-gray-800">{dispute.vendor}</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <label htmlFor="update-status" className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                            <select id="update-status" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-white">
                                <option>Open</option>
                                <option>In Progress</option>
                                <option>Resolved</option>
                            </select>
                             <button onClick={() => handleUpdateDisputeStatus(dispute.id, currentStatus)} className="w-full mt-3 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm font-medium">
                                Update Case
                            </button>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">Resolution Actions</h4>
                            <p className="text-xs text-gray-500 mb-2">These actions will resolve the dispute and trigger a financial transaction.</p>
                            <div className="flex space-x-2">
                                    <button onClick={() => setIsRefundModalOpen(true)} className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs font-medium">
                                    Refund Buyer
                                </button>
                                    <button onClick={() => setIsReleaseModalOpen(true)} className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs font-medium">
                                    Release to Vendor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SupportDisputeDetailScreen;