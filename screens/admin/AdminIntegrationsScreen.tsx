
import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';
import { Integration } from '../../types/index';
import Modal from '../../components/shared/Modal';

const AdminIntegrationsScreen: React.FC = () => {
    // Mock local state for integrations as it's not in the main data service yet
    const [integrations, setIntegrations] = useState<Integration[]>([
        { id: 'int_1', name: 'DHL Express', provider: 'DHL', apiKey: '****', status: 'Active' },
        { id: 'int_2', name: 'Local Logistics', provider: 'Local Freight', apiKey: '****', status: 'Inactive' }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newIntegration, setNewIntegration] = useState<Partial<Integration>>({ provider: 'Custom API', status: 'Active' });

    const handleAddIntegration = () => {
        if (!newIntegration.name || !newIntegration.apiKey) return;
        setIntegrations([...integrations, { 
            id: `int_${Date.now()}`, 
            name: newIntegration.name, 
            provider: newIntegration.provider as any, 
            apiKey: newIntegration.apiKey,
            status: newIntegration.status as any,
            webhookUrl: newIntegration.webhookUrl
        }]);
        setIsModalOpen(false);
        setNewIntegration({ provider: 'Custom API', status: 'Active' });
    };

    const handleDelete = (id: string) => {
        setIntegrations(integrations.filter(i => i.id !== id));
    };

    const toggleStatus = (id: string) => {
        setIntegrations(integrations.map(i => i.id === id ? { ...i, status: i.status === 'Active' ? 'Inactive' : 'Active' } : i));
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Third-Party Integrations</h2>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium">
                    + Add Integration
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {integrations.map(integration => (
                    <div key={integration.id} className="bg-white p-6 rounded-lg shadow border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                    {integration.provider.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{integration.name}</h3>
                                    <p className="text-xs text-slate-500">{integration.provider}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${integration.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                {integration.status}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600 mb-4">
                            <p><span className="font-medium">API Key:</span> •••••••••••••••</p>
                            {integration.webhookUrl && <p><span className="font-medium">Webhook:</span> {integration.webhookUrl}</p>}
                        </div>
                        <div className="flex justify-end space-x-3 pt-3 border-t">
                            <button onClick={() => toggleStatus(integration.id)} className="text-xs font-medium text-blue-600 hover:text-blue-800">
                                {integration.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => handleDelete(integration.id)} className="text-xs font-medium text-red-600 hover:text-red-800">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Integration">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Integration Name</label>
                        <input type="text" value={newIntegration.name || ''} onChange={e => setNewIntegration({...newIntegration, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm bg-white" placeholder="e.g. My DHL Account" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Provider</label>
                        <select value={newIntegration.provider} onChange={e => setNewIntegration({...newIntegration, provider: e.target.value as any})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm bg-white">
                            <option value="DHL">DHL</option>
                            <option value="FedEx">FedEx</option>
                            <option value="Local Freight">Local Freight</option>
                            <option value="Custom API">Custom API</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">API Key / Token</label>
                        <input type="text" value={newIntegration.apiKey || ''} onChange={e => setNewIntegration({...newIntegration, apiKey: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm bg-white" placeholder="Enter API Key" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Webhook URL (Optional)</label>
                        <input type="text" value={newIntegration.webhookUrl || ''} onChange={e => setNewIntegration({...newIntegration, webhookUrl: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded shadow-sm bg-white" placeholder="https://" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button onClick={handleAddIntegration} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save Integration</button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminIntegrationsScreen;
