import React, { useState } from 'react';
import { AppView } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import { useAppContext } from '../../hooks/useAppContext';

const AdminKycDetailScreen: React.FC = () => {
    const { 
        selectedKycUser: kycUser, 
        navigateTo, 
        handleUpdateKycStatus,
        kycFields
    } = useAppContext();

    const [rejectionReason, setRejectionReason] = useState('');

    if (!kycUser) {
        return (
             <DashboardLayout>
                <p>No user selected for KYC review.</p>
                <button onClick={() => navigateTo(AppView.ADMIN_KYC_SUBMISSIONS)}>Back to list</button>
            </DashboardLayout>
        )
    }

    const handleReject = () => {
        if (!rejectionReason) {
            alert('Please provide a reason for rejection.');
            return;
        }
        handleUpdateKycStatus(kycUser.id, 'Rejected', rejectionReason);
    };

    return (
        <DashboardLayout>
             <div>
                <button onClick={() => navigateTo(AppView.ADMIN_KYC_SUBMISSIONS)} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to Submissions
                </button>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Review KYC for {kycUser.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Details */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-700">User Details</h3>
                            <p className="text-sm"><span className="text-gray-500">Name:</span> {kycUser.name}</p>
                            <p className="text-sm"><span className="text-gray-500">Email:</span> {kycUser.email}</p>
                            <p className="text-sm"><span className="text-gray-500">Phone:</span> {kycUser.phone}</p>
                            <p className="text-sm"><span className="text-gray-500">Address:</span> {`${kycUser.address.street}, ${kycUser.address.city}, ${kycUser.address.country}`}</p>
                        </div>
                        {/* Documents */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-700">Submitted Documents</h3>
                            {kycFields.map(field => (
                               <div key={field.id} className="border rounded-md p-3 bg-gray-50">
                                    <p className="font-medium text-sm">{field.label}</p>
                                    <a href="#" className="text-emerald-600 text-sm hover:underline">View Document</a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <h3 className="font-semibold text-gray-700 mb-2">Actions</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <button 
                                onClick={() => handleUpdateKycStatus(kycUser.id, 'Verified')}
                                className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Approve
                            </button>
                            <div className="flex-1 flex flex-col md:flex-row gap-2">
                                <input 
                                    type="text" 
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Reason for rejection (required)" 
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                />
                                <button
                                    onClick={handleReject}
                                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminKycDetailScreen;