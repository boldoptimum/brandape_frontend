
import React, { useState, useMemo } from 'react';
import { AppView, User, UserType } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TrashIcon from '../../components/icons/TrashIcon';
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

const getKycStatusClass = (status: User['kycStatus']) => {
    switch (status) {
        case 'Verified': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const AdminUsersScreen: React.FC = () => {
    const { 
        currentUser, users, navigateTo, 
        handleDeactivateUser, handleBulkDeactivateUsers,
        setSelectedKycUser, setSelectedUserToEdit
    } = useAppContext();

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    
    if (!currentUser) return null;
    
    const availableUsers = useMemo(() => {
        return users.filter(u => {
            const isNotMe = u.id !== currentUser.id;
            const matchesSearch = 
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                u.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter ? getUserTypeString(u.type) === roleFilter : true;
            return isNotMe && matchesSearch && matchesRole;
        });
    }, [users, currentUser.id, searchTerm, roleFilter]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedUserIds(availableUsers.map(u => u.id));
        } else {
            setSelectedUserIds([]);
        }
    };

    const handleSelectOne = (userId: string) => {
        if (selectedUserIds.includes(userId)) {
            setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
        } else {
            setSelectedUserIds([...selectedUserIds, userId]);
        }
    };

    const handleBulkDeactivateClick = () => {
        const usersToDeactivate = users.filter(u => selectedUserIds.includes(u.id));
        if (usersToDeactivate.length > 0) {
            handleBulkDeactivateUsers(usersToDeactivate);
            setSelectedUserIds([]);
        }
    };
    
    const onViewKyc = (user: User) => {
        setSelectedKycUser(user);
        navigateTo(AppView.ADMIN_KYC_DETAIL);
    };
    
    const onEditUser = (user: User) => {
        setSelectedUserToEdit(user);
        navigateTo(AppView.ADMIN_EDIT_USER);
    }
    
    const onAddUser = () => {
        setSelectedUserToEdit(null); // clear to indicate add mode
        navigateTo(AppView.ADMIN_ADD_EDIT_USER);
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-semibold text-slate-800">User Management</h2>
                <div className="flex space-x-2 w-full sm:w-auto">
                    <input 
                        type="search" 
                        placeholder="Search name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-3 py-2 border border-slate-300 rounded shadow-sm sm:text-sm bg-white" 
                    />
                    <select 
                        value={roleFilter} 
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                    >
                        <option value="">All Roles</option>
                        <option value="Buyer">Buyer</option>
                        <option value="Vendor">Vendor</option>
                        <option value="Support">Support</option>
                        <option value="Admin">Admin</option>
                    </select>
                     <button onClick={onAddUser} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium flex items-center whitespace-nowrap">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add User
                    </button>
                </div>
            </div>
             {selectedUserIds.length > 0 && (
                <div className="mb-4">
                    <button 
                        onClick={handleBulkDeactivateClick} 
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium flex items-center"
                    >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Deactivate Selected ({selectedUserIds.length})
                    </button>
                </div>
            )}
            <div className="bg-white shadow rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input 
                                            id="checkbox-all-users" 
                                            type="checkbox" 
                                            onChange={handleSelectAll} 
                                            checked={availableUsers.length > 0 && selectedUserIds.length === availableUsers.length}
                                            className="w-4 h-4 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500"
                                        />
                                        <label htmlFor="checkbox-all-users" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">User Type</th>
                                <th scope="col" className="px-6 py-3">KYC Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availableUsers.map(u => (
                                <tr key={u.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input 
                                                id={`checkbox-user-${u.id}`} 
                                                type="checkbox" 
                                                onChange={() => handleSelectOne(u.id)}
                                                checked={selectedUserIds.includes(u.id)}
                                                className="w-4 h-4 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500"
                                            />
                                            <label htmlFor={`checkbox-user-${u.id}`} className="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                                    <td className="px-6 py-4">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUserTypeClass(u.type)}`}>
                                            {getUserTypeString(u.type)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getKycStatusClass(u.kycStatus)}`}>
                                            {u.kycStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-4">
                                            <button onClick={() => onEditUser(u)} className="text-emerald-600 hover:underline text-xs">Edit</button>
                                            {(u.kycStatus === 'Pending' || u.kycStatus === 'Rejected') && (
                                                <button onClick={() => onViewKyc(u)} className="text-blue-600 hover:underline text-xs">Review KYC</button>
                                            )}
                                            <button 
                                                onClick={() => handleDeactivateUser(u)}
                                                className="text-red-600 hover:underline text-xs"
                                                disabled={u.status === 'Inactive'}
                                            >
                                                {u.status === 'Inactive' ? 'Inactive' : 'Deactivate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {availableUsers.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-4">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminUsersScreen;
