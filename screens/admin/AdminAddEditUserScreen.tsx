
import React, { useState } from 'react';
import { AppView, UserType } from '../../types/index';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import { useAppContext } from '../../hooks/useAppContext';

const AdminAddEditUserScreen: React.FC = () => {
  const { navigateTo, handleCreateUser } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>(UserType.BUYER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill out all fields.");
      return;
    }
    handleCreateUser({
      name,
      email,
      password,
      type: userType
    });
  };
  
  return (
    <DashboardLayout>
       <div>
         <button onClick={() => navigateTo(AppView.ADMIN_USERS)} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Users
        </button>
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">User Type</label>
                    <select value={userType} onChange={e => setUserType(Number(e.target.value) as UserType)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md">
                        <option value={UserType.BUYER}>Buyer</option>
                        <option value={UserType.VENDOR}>Vendor</option>
                        <option value={UserType.SUPPORT_AGENT}>Support Agent</option>
                        <option value={UserType.SUPER_ADMIN}>Super Admin</option>
                    </select>
                </div>
                 <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={() => navigateTo(AppView.ADMIN_USERS)} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm font-medium">Create User</button>
                </div>
            </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAddEditUserScreen;