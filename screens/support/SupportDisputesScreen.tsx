
import React, { useState, useMemo } from 'react';
import { AppView, Dispute } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Resolved': return 'bg-green-100 text-green-800';
        case 'In Progress': return 'bg-blue-100 text-blue-800';
        case 'Open': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const SupportDisputesScreen: React.FC = () => {
    const { disputes, setSelectedDispute, navigateTo } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredDisputes = useMemo(() => {
        return disputes.filter(dispute => {
            const matchesSearch = 
                dispute.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                dispute.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dispute.vendor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter ? dispute.status === statusFilter : true;
            return matchesSearch && matchesStatus;
        });
    }, [disputes, searchTerm, statusFilter]);

    const onViewDispute = (dispute: Dispute) => {
        setSelectedDispute(dispute);
        navigateTo(AppView.SUPPORT_DISPUTE_DETAIL);
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-semibold text-gray-800">Dispute Resolution Center</h2>
                 <div className="flex space-x-2 w-full sm:w-auto">
                    <input 
                        type="search" 
                        placeholder="Search Order ID, Buyer, Vendor..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm" 
                    />
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                    >
                        <option value="">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Case ID</th>
                                <th scope="col" className="px-6 py-3">Order ID</th>
                                <th scope="col" className="px-6 py-3">Date Opened</th>
                                <th scope="col" className="px-6 py-3">Buyer</th>
                                <th scope="col" className="px-6 py-3">Vendor</th>
                                <th scope="col" className="px-6 py-3">Reason</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDisputes.length > 0 ? filteredDisputes.map((dispute) => (
                                <tr key={dispute.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        {dispute.id}
                                    </th>
                                    <td className="px-6 py-4">{dispute.orderId}</td>
                                    <td className="px-6 py-4">{dispute.date}</td>
                                    <td className="px-6 py-4">{dispute.buyer}</td>
                                    <td className="px-6 py-4">{dispute.vendor}</td>
                                    <td className="px-6 py-4">{dispute.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(dispute.status)}`}>
                                            {dispute.status}
                                        </span>
                                    </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => onViewDispute(dispute)} className="font-medium text-emerald-600 hover:underline">View Case</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={8} className="text-center py-4">No disputes found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SupportDisputesScreen;
