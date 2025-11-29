
import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';
import Modal from '../../components/shared/Modal';

const AdminEmailComposeScreen: React.FC = () => {
    const { users, handleSendEmail, emailLogs, campaignGroups, handleCreateCampaignGroup, handleDeleteCampaignGroup } = useAppContext();
    const [recipientGroup, setRecipientGroup] = useState('All Users');
    // specificUserId replaced by list
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    
    // Group Creation Modal
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        // Passing the first ID if specific user, or handling multiple in backend simulation (for now simplistic)
        // In real scenario, backend would handle list of IDs
        handleSendEmail(recipientGroup, subject, body, selectedUserIds.length > 0 ? selectedUserIds[0] : undefined);
        
        setSubject('');
        setBody('');
        setSelectedUserIds([]);
        setRecipientGroup('All Users');
    };

    const toggleUserSelection = (id: string) => {
        if(selectedUserIds.includes(id)) {
            setSelectedUserIds(prev => prev.filter(uid => uid !== id));
        } else {
            setSelectedUserIds(prev => [...prev, id]);
        }
    };

    const saveGroup = () => {
        if(newGroupName && selectedUserIds.length > 0) {
            handleCreateCampaignGroup(newGroupName, selectedUserIds, newGroupDesc);
            setIsGroupModalOpen(false);
            setNewGroupName('');
            setNewGroupDesc('');
        }
    };

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Compose Email</h2>
                    <div className="bg-white p-6 rounded-lg shadow border border-slate-100">
                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Recipient Group</label>
                                <select 
                                    value={recipientGroup} 
                                    onChange={e => setRecipientGroup(e.target.value)} 
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white"
                                >
                                    <option value="All Users">All Users</option>
                                    <option value="All Buyers">All Buyers</option>
                                    <option value="All Vendors">All Vendors</option>
                                    <option value="Specific Users">Specific Users</option>
                                    <optgroup label="Campaign Groups">
                                        {campaignGroups.map(g => <option key={g.id} value={`GROUP:${g.id}`}>{g.name}</option>)}
                                    </optgroup>
                                </select>
                            </div>
                            
                            {recipientGroup === 'Specific Users' && (
                                <div className="border p-4 rounded bg-slate-50 max-h-60 overflow-y-auto">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold">Select Users ({selectedUserIds.length})</span>
                                        <button type="button" onClick={() => setIsGroupModalOpen(true)} disabled={selectedUserIds.length === 0} className="text-xs text-emerald-600 hover:underline disabled:text-slate-400 font-medium">
                                            Save as Campaign Group
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {users.map(u => (
                                            <label key={u.id} className="flex items-center space-x-2 py-1 px-2 hover:bg-slate-100 rounded cursor-pointer">
                                                <input type="checkbox" checked={selectedUserIds.includes(u.id)} onChange={() => toggleUserSelection(u.id)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                                                <span className="text-sm text-slate-700">{u.name} <span className="text-slate-400 text-xs">({u.email})</span></span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Subject</label>
                                <input 
                                    required 
                                    type="text" 
                                    value={subject} 
                                    onChange={e => setSubject(e.target.value)} 
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" 
                                    placeholder="Enter subject line"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Message Body</label>
                                <textarea 
                                    required 
                                    rows={10} 
                                    value={body} 
                                    onChange={e => setBody(e.target.value)} 
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded bg-white" 
                                    placeholder="Type your message here..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    Send Email
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sent History</h2>
                        <div className="bg-white rounded-lg shadow border border-slate-100 overflow-hidden">
                            <div className="max-h-[300px] overflow-y-auto">
                                {emailLogs.length > 0 ? emailLogs.map(log => (
                                    <div key={log.id} className="p-4 border-b border-slate-100 hover:bg-slate-50">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{log.status}</span>
                                            <span className="text-xs text-slate-400">{log.date}</span>
                                        </div>
                                        <h4 className="font-medium text-slate-800 text-sm truncate">{log.subject}</h4>
                                        <p className="text-xs text-slate-500 mt-1">To: {log.recipientGroup} {log.recipientEmail ? `(${log.recipientEmail})` : ''}</p>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-slate-500 text-sm">No emails sent yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Campaign Groups</h3>
                        <div className="bg-white rounded-lg shadow border border-slate-100 overflow-hidden">
                             {campaignGroups.length > 0 ? (
                                 <ul className="divide-y divide-slate-100">
                                     {campaignGroups.map(g => (
                                         <li key={g.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                             <div>
                                                 <p className="font-medium text-sm text-slate-800">{g.name}</p>
                                                 <p className="text-xs text-slate-500">{g.userIds.length} users</p>
                                             </div>
                                             <button onClick={() => handleDeleteCampaignGroup(g.id)} className="text-red-500 hover:text-red-700">
                                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                             </button>
                                         </li>
                                     ))}
                                 </ul>
                             ) : (
                                 <div className="p-4 text-center text-xs text-slate-500">No groups created.</div>
                             )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} title="Create Campaign Group">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Group Name</label>
                        <input type="text" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded" placeholder="e.g. VIP Buyers" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <input type="text" value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded" placeholder="Optional description" />
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button onClick={saveGroup} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save Group</button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default AdminEmailComposeScreen;
