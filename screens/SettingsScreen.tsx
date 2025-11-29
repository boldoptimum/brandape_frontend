
import React, { useState } from 'react';
import { AppView, User, UserType } from '../types/index';
import DashboardLayout from '../components/layouts/DashboardLayout';
import FileUpload from '../components/shared/FileUpload';
import { useAppContext } from '../hooks/useAppContext';

const getKycStatusClass = (status: User['kycStatus']) => {
    switch (status) {
        case 'Verified': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const fileToDataUri = (file: File) => new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        resolve(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });


const SettingsScreen: React.FC = () => {
  const { 
      currentUser, navigateTo, 
      handleUpdateProfile, handleUpdatePassword, handleUpdateAddress
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('profile');
  
  if (!currentUser) return null;
  
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState(currentUser.address);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);

  const handleProfileSave = () => {
      handleUpdateProfile(name, phone, avatarUrl);
  };
  
  const handlePasswordSave = () => {
    if (newPassword.length < 6) {
        alert("New password must be at least 6 characters long.");
        return;
    }
    if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }
    handleUpdatePassword(newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleAddressSave = () => {
      handleUpdateAddress(address);
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'profile':
              return (
                  <form onSubmit={e => {e.preventDefault(); handleProfileSave();}} className="space-y-4">
                      <div className="flex items-center space-x-6">
                        <div className="w-48">
                          <FileUpload 
                            label="Profile Picture" 
                            onFileChange={async (file) => {
                              if(file) {
                                  const dataUri = await fileToDataUri(file);
                                  setAvatarUrl(dataUri);
                                }
                            }} 
                            currentImageUrl={avatarUrl}
                            isAvatar={true}
                          />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700">Full Name</label>
                              <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                          </div>
                        </div>
                      </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700">Email Address</label>
                          <input type="email" value={currentUser.email} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" readOnly />
                      </div>
                      <div className="pt-4">
                          <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Save Changes</button>
                      </div>
                  </form>
              );
          case 'security':
               return (
                  <form onSubmit={e => {e.preventDefault(); handlePasswordSave()}} className="space-y-4 max-w-md">
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Current Password</label>
                          <input type="password" placeholder="••••••••" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">New Password</label>
                          <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                          <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div className="pt-4">
                          <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Update Password</button>
                      </div>
                  </form>
              );
           case 'address':
               return (
                   <form onSubmit={e => {e.preventDefault(); handleAddressSave()}} className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Street Address</label>
                          <input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">City</label>
                          <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Country</label>
                          <input type="text" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                         <div className="pt-4">
                          <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Update Address</button>
                      </div>
                   </form>
               );
          case 'kyc':
              return (
                  <div>
                      <h3 className="text-lg font-semibold text-gray-800">KYC Verification</h3>
                      <p className="text-sm text-gray-600 mt-1">To ensure the security of our platform, we require identity verification.</p>
                      <div className="mt-4 p-4 border rounded-lg flex items-center justify-between">
                          <div>
                              <p className="text-sm text-gray-600">Your current status:</p>
                              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getKycStatusClass(currentUser.kycStatus)}`}>{currentUser.kycStatus}</span>
                          </div>
                          {currentUser.kycStatus !== 'Verified' && currentUser.kycStatus !== 'Pending' && (
                            <button onClick={() => navigateTo(AppView.KYC_SUBMISSION)} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm">
                                {currentUser.kycStatus === 'Not Submitted' ? 'Start Verification' : 'Resubmit Documents'}
                            </button>
                          )}
                      </div>
                      {currentUser.kycStatus === 'Rejected' && (
                          <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg text-sm text-red-700">
                              <p className="font-semibold">Submission Rejected</p>
                              <p>Reason: {currentUser.kycRejectionReason}</p>
                          </div>
                      )}
                  </div>
              );
        case 'admin':
             return (
                  <div>
                      <h3 className="text-lg font-semibold text-slate-800">Administrator Settings</h3>
                      <p className="text-sm text-slate-600 mt-1">Manage platform-wide settings.</p>
                      <div className="mt-4 space-y-4">
                        <div className="border border-slate-200 rounded-lg p-4 flex justify-between items-center bg-white">
                            <div>
                                <h4 className="font-medium text-slate-800">KYC Requirements</h4>
                                <p className="text-xs text-slate-500">Define the documents and information required for user verification.</p>
                            </div>
                            <button onClick={() => navigateTo(AppView.ADMIN_KYC_SETTINGS)} className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">Manage</button>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4 flex justify-between items-center bg-white">
                            <div>
                                <h4 className="font-medium text-slate-800">Homepage Content</h4>
                                <p className="text-xs text-slate-500">Edit text and images on the public homepage.</p>
                            </div>
                            <button onClick={() => navigateTo(AppView.ADMIN_CONTENT_MANAGEMENT)} className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">Manage</button>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4 flex justify-between items-center bg-white">
                            <div>
                                <h4 className="font-medium text-slate-800">Third-Party Integrations</h4>
                                <p className="text-xs text-slate-500">Manage connections with Freight agencies and other external services.</p>
                            </div>
                            <button onClick={() => navigateTo(AppView.ADMIN_INTEGRATIONS)} className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">Manage</button>
                        </div>
                      </div>
                  </div>
              );
          default: return null;
      }
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <div className="border-b mb-6">
            <nav className="-mb-px flex space-x-8">
                <button onClick={() => setActiveTab('profile')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Profile</button>
                <button onClick={() => setActiveTab('security')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Security</button>
                <button onClick={() => setActiveTab('address')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'address' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Address</button>
                {(currentUser.type === UserType.VENDOR || currentUser.type === UserType.BUYER) && (
                  <button onClick={() => setActiveTab('kyc')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'kyc' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>KYC Verification</button>
                )}
                 {currentUser.type === UserType.SUPER_ADMIN && (
                  <button onClick={() => setActiveTab('admin')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'admin' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Platform</button>
                )}
            </nav>
        </div>
        <div>
            {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsScreen;
