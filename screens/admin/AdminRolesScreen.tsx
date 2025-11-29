
import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';
import { Role, Permission } from '../../types/index';
import Modal from '../../components/shared/Modal';

const availablePermissions: {id: Permission, label: string}[] = [
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'manage_products', label: 'Manage Products' },
    { id: 'manage_orders', label: 'Manage Orders' },
    { id: 'manage_content', label: 'Manage Content' },
    { id: 'manage_platform', label: 'Manage Platform Settings' },
    { id: 'manage_finance', label: 'Manage Finances' },
    { id: 'manage_roles', label: 'Manage Roles' },
];

const AdminRolesScreen: React.FC = () => {
    const { roles, handleAddRole, handleUpdateRole, handleDeleteRole } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);

    const handleOpenModal = (role?: Role) => {
        if (role) {
            setEditingRole(role);
            setRoleName(role.name);
            setSelectedPermissions(role.permissions);
        } else {
            setEditingRole(null);
            setRoleName('');
            setSelectedPermissions([]);
        }
        setIsModalOpen(true);
    };

    const handleTogglePermission = (permId: Permission) => {
        if (selectedPermissions.includes(permId)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== permId));
        } else {
            setSelectedPermissions([...selectedPermissions, permId]);
        }
    };

    const handleSaveRole = () => {
        if (!roleName.trim()) return;
        
        if (editingRole) {
            handleUpdateRole({ ...editingRole, name: roleName, permissions: selectedPermissions });
        } else {
            const newRole: Role = {
                id: `role_${Date.now()}`,
                name: roleName,
                permissions: selectedPermissions
            };
            handleAddRole(newRole);
        }
        setIsModalOpen(false);
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Role Management</h2>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium">
                    + Create Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="bg-white p-6 rounded-lg shadow border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-slate-800">{role.name}</h3>
                            <div className="flex space-x-2">
                                <button onClick={() => handleOpenModal(role)} className="text-slate-400 hover:text-emerald-600">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={() => handleDeleteRole(role.id)} className="text-slate-400 hover:text-red-600">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Permissions</p>
                            <div className="flex flex-wrap gap-2">
                                {role.permissions.map(perm => (
                                    <span key={perm} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                                        {perm.replace('manage_', '')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRole ? 'Edit Role' : 'Create New Role'}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Role Name</label>
                        <input 
                            type="text" 
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm bg-white"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="e.g. Moderator"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Permissions</label>
                        <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded">
                            {availablePermissions.map(perm => (
                                <div key={perm.id} className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id={perm.id} 
                                        checked={selectedPermissions.includes(perm.id)}
                                        onChange={() => handleTogglePermission(perm.id)}
                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={perm.id} className="ml-2 block text-sm text-slate-700">
                                        {perm.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button onClick={handleSaveRole} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save Role</button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminRolesScreen;
