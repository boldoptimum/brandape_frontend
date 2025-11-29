
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';
import { EmailConfiguration } from '../../types/index';

const AdminEmailSettingsScreen: React.FC = () => {
    const { emailSettings, handleSaveEmailConfig } = useAppContext();
    
    const [config, setConfig] = useState<EmailConfiguration>({
        host: '',
        port: '',
        username: '',
        password: '',
        encryption: 'tls',
        senderName: '',
        senderEmail: ''
    });

    useEffect(() => {
        if (emailSettings) {
            setConfig(emailSettings);
        }
    }, [emailSettings]);

    const handleChange = (field: keyof EmailConfiguration, value: string) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveEmailConfig(config);
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Email Settings (SMTP)</h2>
                <div className="bg-white p-6 rounded-lg shadow border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">SMTP Host</label>
                                <input required type="text" value={config.host} onChange={e => handleChange('host', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" placeholder="smtp.example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Port</label>
                                <input required type="text" value={config.port} onChange={e => handleChange('port', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" placeholder="587" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Username</label>
                                <input required type="text" value={config.username} onChange={e => handleChange('username', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <input required type="password" value={config.password} onChange={e => handleChange('password', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Encryption</label>
                            <select value={config.encryption} onChange={e => handleChange('encryption', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white">
                                <option value="tls">TLS</option>
                                <option value="ssl">SSL</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                        <div className="border-t pt-6 mt-6">
                            <h3 className="text-lg font-medium text-slate-900 mb-4">Sender Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Sender Name</label>
                                    <input required type="text" value={config.senderName} onChange={e => handleChange('senderName', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" placeholder="BrandApe Support" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Sender Email</label>
                                    <input required type="email" value={config.senderEmail} onChange={e => handleChange('senderEmail', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" placeholder="support@brandape.com" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save Configuration</button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminEmailSettingsScreen;
