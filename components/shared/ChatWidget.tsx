
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { UserType } from '../../types/index';

const ChatWidget: React.FC = () => {
    const { 
        currentUser, isChatWidgetOpen, toggleChatWidget, 
        chatSessions, handleStartSupportChat, handleSendChatMessage 
    } = useAppContext();
    
    const [message, setMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Only show for Buyers and Vendors
    if (!currentUser || (currentUser.type !== UserType.BUYER && currentUser.type !== UserType.VENDOR)) {
        return null;
    }

    const activeSession = chatSessions.find(s => s.userId === currentUser.id && s.status === 'Open');

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeSession?.messages, isChatWidgetOpen]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        if (activeSession) {
            handleSendChatMessage(activeSession.id, message);
        } else {
            handleStartSupportChat(message);
        }
        setMessage('');
    };

    return (
        <>
            {/* FAB */}
            <button 
                onClick={toggleChatWidget}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-transform hover:scale-105 z-50 flex items-center justify-center ${isChatWidgetOpen ? 'bg-slate-800 rotate-90' : 'bg-emerald-600'}`}
            >
                {isChatWidgetOpen ? (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                )}
            </button>

            {/* Widget Window */}
            <div className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isChatWidgetOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`} style={{height: '500px'}}>
                {/* Header */}
                <div className="bg-emerald-600 p-4 rounded-t-xl text-white">
                    <h3 className="font-bold text-lg">Support Chat</h3>
                    <p className="text-xs text-emerald-100 opacity-90">We typically reply within a few minutes.</p>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50" ref={scrollRef}>
                    {!activeSession ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-2">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </div>
                            <p>How can we help you today?</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeSession.messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.isAdmin ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' : 'bg-emerald-600 text-white rounded-tr-none'}`}>
                                        <p>{msg.text}</p>
                                        <span className={`text-[10px] block mt-1 ${msg.isAdmin ? 'text-slate-400' : 'text-emerald-200'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white rounded-b-xl">
                    <div className="flex space-x-2">
                        <input 
                            type="text" 
                            className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors flex-shrink-0"
                            disabled={!message.trim()}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChatWidget;
