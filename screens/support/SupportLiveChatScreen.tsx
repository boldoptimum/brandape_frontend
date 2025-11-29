
import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useAppContext } from '../../hooks/useAppContext';
import { ChatSession } from '../../types/index';

const SupportLiveChatScreen: React.FC = () => {
    const { chatSessions, handleSendChatMessage, handleResolveChat, currentUser } = useAppContext();
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [reply, setReply] = useState('');

    const openSessions = chatSessions.filter(s => s.status === 'Open').sort((a,b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime());
    const selectedSession = chatSessions.find(s => s.id === selectedSessionId);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSessionId && reply.trim()) {
            handleSendChatMessage(selectedSessionId, reply, true);
            setReply('');
        }
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                {/* Sidebar List */}
                <div className="w-1/3 border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-semibold text-slate-800">Active Conversations ({openSessions.length})</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {openSessions.map(session => (
                            <button 
                                key={session.id}
                                onClick={() => setSelectedSessionId(session.id)}
                                className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${selectedSessionId === session.id ? 'bg-emerald-50 border-l-4 border-l-emerald-600' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-slate-800 text-sm">{session.userName}</span>
                                    <span className="text-xs text-slate-400">{new Date(session.lastMessageDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{session.lastMessage}</p>
                                <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 inline-block">{session.userType === 1 ? 'Buyer' : 'Vendor'}</span>
                            </button>
                        ))}
                        {openSessions.length === 0 && (
                            <div className="p-8 text-center text-slate-500 text-sm">No active chats.</div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="w-2/3 flex flex-col bg-slate-50">
                    {selectedSession ? (
                        <>
                            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-800">{selectedSession.userName}</h3>
                                    <p className="text-xs text-slate-500">ID: {selectedSession.userId}</p>
                                </div>
                                <button 
                                    onClick={() => handleResolveChat(selectedSession.id)}
                                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 text-xs font-medium rounded hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                >
                                    End Chat
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {selectedSession.messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-lg p-3 text-sm shadow-sm ${msg.isAdmin ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                                            <p>{msg.text}</p>
                                            <span className={`text-[10px] block mt-1 text-right ${msg.isAdmin ? 'text-emerald-200' : 'text-slate-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-white border-t border-slate-200">
                                <form onSubmit={handleSend} className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                        placeholder="Type your reply..."
                                    />
                                    <button 
                                        type="submit" 
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium text-sm"
                                        disabled={!reply.trim()}
                                    >
                                        Send
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 flex-col">
                            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            <p>Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SupportLiveChatScreen;
