

import React from 'react';
import { AppView, User } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';

const AdminKycSubmissionsScreen: React.FC = () => {
    const { users, navigateTo, setSelectedKycUser } = useAppContext();
    
    const pendingSubmissions = users.filter(u => u.kycStatus === 'Pending');
    
    const onViewKyc = (user: User) => {
        setSelectedKycUser(user);
        navigateTo(AppView.ADMIN_KYC_DETAIL);
    }
    
    return (
        <DashboardLayout>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">KYC Submissions</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">User Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">User Type</th>
                                <th scope="col" className="px-6 py-3">Submitted On</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingSubmissions.length > 0 ? (
                                pendingSubmissions.map(u => (
                                    <tr key={u.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                                        <td className="px-6 py-4">{u.email}</td>
                                        <td className="px-6 py-4">{u.type === 1 ? 'Buyer' : 'Vendor'}</td>
                                        <td className="px-6 py-4">{new Date().toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => onViewKyc(u)} className="font-medium text-emerald-600 hover:underline">
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        No pending KYC submissions.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminKycSubmissionsScreen;